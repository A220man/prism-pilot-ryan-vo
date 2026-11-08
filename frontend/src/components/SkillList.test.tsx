import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SkillList } from './SkillList'
import { catalogApi } from '../api/catalog'

// Mock the catalog API
vi.mock('../api/catalog', () => ({
  catalogApi: {
    listSkills: vi.fn(),
    getCategories: vi.fn(),
    getSubcategories: vi.fn(),
  },
}))

const mockSkills = [
  {
    id: 1,
    name: 'skill-1',
    display_name: 'Skill One',
    description: 'First test skill',
    category: 'ml',
    subcategory: 'training',
    tags: ['tensorflow'],
    version: '1.0.0',
    author: 'Author One',
    source_url: null,
    license: 'MIT',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'skill-2',
    display_name: 'Skill Two',
    description: 'Second test skill',
    category: 'nlp',
    subcategory: 'inference',
    tags: ['pytorch', 'transformers'],
    version: '2.0.0',
    author: 'Author Two',
    source_url: null,
    license: 'Apache-2.0',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
]

const mockListResponse = {
  items: mockSkills,
  total: 2,
  page: 1,
  page_size: 20,
  total_pages: 1,
}

describe('SkillList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    ;(catalogApi.getCategories as any).mockResolvedValue(['ml', 'nlp', 'cv'])
    ;(catalogApi.getSubcategories as any).mockResolvedValue(['training', 'inference'])
  })

  it('shows loading state initially', () => {
    ;(catalogApi.listSkills as any).mockImplementation(() => new Promise(() => {}))
    render(<SkillList />)
    expect(screen.getByText('Loading skills…')).toBeInTheDocument()
  })

  it('renders skills after loading', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByText('Skill One')).toBeInTheDocument()
      expect(screen.getByText('Skill Two')).toBeInTheDocument()
    })
  })

  it('shows error state on fetch failure', async () => {
    ;(catalogApi.listSkills as any).mockRejectedValue(new Error('Network error'))
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  it('retries on retry button click', async () => {
    ;(catalogApi.listSkills as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Retry'))
    await waitFor(() => {
      expect(screen.getByText('Skill One')).toBeInTheDocument()
    })
  })

  it('filters by search term', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument()
    })
    const searchInput = screen.getByPlaceholderText('Search skills…')
    fireEvent.change(searchInput, { target: { value: 'tensor' } })
    await waitFor(() => {
      expect(catalogApi.listSkills).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'tensor', page: 1 })
      )
    })
  })

  it('filters by category', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      // Wait for skills to load and category dropdown to be populated
      expect(screen.getByText('Skill One')).toBeInTheDocument()
    })
    // Use the select element directly since label doesn't have htmlFor
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.change(categorySelect, { target: { value: 'nlp' } })
    await waitFor(() => {
      expect(catalogApi.listSkills).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'nlp', page: 1 })
      )
    })
  })

  it('resets to page 1 when filter changes', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByText('Skill One')).toBeInTheDocument()
    })
    const searchInput = screen.getByPlaceholderText('Search skills…')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    await waitFor(() => {
      expect(catalogApi.listSkills).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      )
    })
  })

  it('loads categories on mount', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue(mockListResponse)
    render(<SkillList />)
    await waitFor(() => {
      expect(catalogApi.getCategories).toHaveBeenCalled()
    })
  })

  it('shows empty state when no skills match', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue({
      ...mockListResponse,
      items: [],
      total: 0,
      total_pages: 0,
    })
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.queryByText('Skill One')).not.toBeInTheDocument()
      expect(screen.getByText('No skills found. Try adjusting your filters.')).toBeInTheDocument()
    })
  })

  it('paginates correctly with next/previous buttons', async () => {
    const paginatedResponse = {
      ...mockListResponse,
      total: 50,
      page: 1,
      total_pages: 3,
    }
    ;(catalogApi.listSkills as any)
      .mockResolvedValueOnce(paginatedResponse)
      .mockResolvedValueOnce({ ...paginatedResponse, page: 2 })
    render(<SkillList />)
    await waitFor(() => {
      expect(screen.getByText('Skill One')).toBeInTheDocument()
      expect(screen.getByText('Page 1 of 3 (50 total)')).toBeInTheDocument()
    })
    // Click Next button
    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).not.toBeDisabled()
    fireEvent.click(nextButton)
    await waitFor(() => {
      expect(catalogApi.listSkills).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      )
    })
  })

  it('disables previous button on first page', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue({
      ...mockListResponse,
      total: 50,
      page: 1,
      total_pages: 3,
    })
    render(<SkillList />)
    await waitFor(() => {
      const prevButton = screen.getByRole('button', { name: 'Previous' })
      expect(prevButton).toBeDisabled()
    })
  })

  it('disables next button on last page', async () => {
    ;(catalogApi.listSkills as any).mockResolvedValue({
      ...mockListResponse,
      total: 50,
      page: 3,
      total_pages: 3,
    })
    render(<SkillList />)
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).toBeDisabled()
    })
  })
})
