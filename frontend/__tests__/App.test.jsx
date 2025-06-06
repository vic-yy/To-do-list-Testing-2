import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from '../src/App';
import memoService from '../src/services/memoService';

vi.mock('../src/services/memoService');

describe('App', () => {
    // 1 - Deve buscar os memos iniciais ao ser renderizado
    it('test call getAllMemos at the start of render', async () => {
        const mockMemos = [
            { id: 1, title: 'Lembrete Antigo', status: 'pendente', created_at: '12/12/0000' },
            { id: 2, title: 'Lembrete Recente', status: 'pendente', created_at: '10/05/9999' }
        ];
        memoService.getAllMemos.mockResolvedValue(mockMemos);
        render(<App />);

        // Verifica se a função de buscar memos foi chamada
        await waitFor(() => {
            expect(memoService.getAllMemos).toHaveBeenCalledTimes(mockMemos.length);
        });

        // Verifica se a tela inicial é renderizada corretamente e completamente
        expect(screen.getByText('MemoKeeper')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Adicione o lembrete/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/dd\/mm\/aaaa/i)).toBeInTheDocument();  
        expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();

        expect(screen.getByText(/Memos List/i)).toBeInTheDocument();
        // Verifica se os memos estão sendo exibidos
        mockMemos.forEach(memo => {
            expect(screen.getByText(memo.title)).toBeInTheDocument();
            expect(screen.getByText(memo.created_at)).toBeInTheDocument();
        });
    });
});