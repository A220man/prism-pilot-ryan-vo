import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
// Mock fetch globally
global.fetch = vi.fn();
describe('App', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    it('renders loading state initially', () => {
        ;
        fetch.mockImplementation(() => new Promise(() => { }));
        render(_jsx(App, {}));
        expect(screen.getByText(/Loading health check/)).toBeInTheDocument();
    });
    it('renders health data on success', async () => {
        ;
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ status: 'ok', service: 'prism-pilot' }),
        });
        render(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('ok')).toBeInTheDocument();
            expect(screen.getByText('prism-pilot')).toBeInTheDocument();
        });
    });
    it('renders error on fetch failure', async () => {
        ;
        fetch.mockRejectedValue(new Error('Network error'));
        render(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('Failed to load health: Network error')).toBeInTheDocument();
        });
    });
});
