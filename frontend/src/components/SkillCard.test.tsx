import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillCard } from './SkillCard'

const mockSkill = {
  id: 1,
  name: 'test-skill',
  display_name: 'Test Skill',
  description: 'A test skill for unit testing',
  category: 'ml',
  subcategory: 'training',
  tags: ['tensorflow', 'pytorch', 'gpu'],
  version: '1.0.0',
  author: 'Test Author',
  source_url: 'https://example.com',
  license: 'MIT',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('SkillCard', () => {
  it('renders skill display name, category, and description', () => {
    render(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('Test Skill')).toBeInTheDocument()
    expect(screen.getByText('ml')).toBeInTheDocument()
    expect(screen.getByText('A test skill for unit testing')).toBeInTheDocument()
  })

  it('renders subcategory when present', () => {
    render(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('training')).toBeInTheDocument()
  })

  it('does not render subcategory when null', () => {
    const skillNoSub = { ...mockSkill, subcategory: null }
    render(<SkillCard skill={skillNoSub} />)
    expect(screen.queryByText('training')).not.toBeInTheDocument()
  })

  it('renders tags with limit of 5 and shows +N more', () => {
    const skillManyTags = {
      ...mockSkill,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'],
    }
    render(<SkillCard skill={skillManyTags} />)
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag5')).toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
    expect(screen.queryByText('tag6')).not.toBeInTheDocument()
  })

  it('renders version and author', () => {
    render(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('v1.0.0')).toBeInTheDocument()
    expect(screen.getByText('by Test Author')).toBeInTheDocument()
  })

  it('does not render author when null', () => {
    const skillNoAuthor = { ...mockSkill, author: null }
    render(<SkillCard skill={skillNoAuthor} />)
    expect(screen.queryByText('by Test Author')).not.toBeInTheDocument()
  })

  it('applies pointer cursor and hover effects when onClick provided', () => {
    const handleClick = vi.fn()
    const { container } = render(<SkillCard skill={mockSkill} onClick={handleClick} />)
    const card = container.querySelector('.skill-card')
    expect(card).toHaveStyle({ cursor: 'pointer' })

    fireEvent.mouseEnter(card!)
    expect(card).toHaveStyle({ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' })

    fireEvent.mouseLeave(card!)
    expect(card).toHaveStyle({ boxShadow: 'none' })
  })

  it('does not apply hover effects when onClick not provided', () => {
    const { container } = render(<SkillCard skill={mockSkill} />)
    const card = container.querySelector('.skill-card')
    expect(card).toHaveStyle({ cursor: 'default' })

    fireEvent.mouseEnter(card!)
    expect(card).not.toHaveStyle({ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' })
  })

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn()
    render(<SkillCard skill={mockSkill} onClick={handleClick} />)
    fireEvent.click(screen.getByText('Test Skill'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
