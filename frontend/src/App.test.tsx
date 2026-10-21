import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

// Mock fetch globally
global.fetch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    ;(fetch as any).mockImplementation(() => new Promise(() => {}))
    render(<App />)
    expect(screen.getByText(/Loading health check/)).toBeInTheDocument()
  })

  it('renders health data on success', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', service: 'prism-pilot' }),
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('ok')).toBeInTheDocument()
      expect(screen.getByText('prism-pilot')).toBeInTheDocument()
    })
  })

  it('renders error on fetch failure', async () => {
    ;(fetch as any).mockRejectedValue(new Error('Network error'))
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load health: Network error')).toBeInTheDocument()
    })
  })
})