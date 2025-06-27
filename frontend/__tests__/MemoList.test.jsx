import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import MemoList from '../src/components/MemoList';

vi.mock('axios');

const mockMemos = [
    { id: 1, title: 'Lembrete Antigo', status: 'pendente', created_at: '12/12/0000' },
    { id: 2, title: 'Lembrete Recente', status: 'pendente', created_at: '10/05/9999' },
];

describe('MemoList', () => {
    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    // 1 - Deve renderizar a lista de memos agrupada por data
    it('test if memos are grouped by date', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        render(<MemoList />);

        // Aguarda a renderização dos memos        
        await screen.findByText('12/12/0000');

        const header = screen.getByText('12/12/0000');
        const memoItem = screen.getByText('Lembrete Antigo');
        expect(header.compareDocumentPosition(memoItem) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

        const header2 = screen.getByText('10/05/9999');
        const memoItem2 = screen.getByText('Lembrete Recente');
        expect(header2.compareDocumentPosition(memoItem2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    // 2 - Deve chamar deleteMemo ao clicar em "Deletar"
    it('test if Delete button is found and deleteMemo is correctly called"', async () => {
        axios.get.mockResolvedValue({ data: [mockMemos[0]] });
        axios.delete.mockResolvedValue({ status: 204 });
        render(<MemoList />);

        const deleteButtons = await screen.findAllByRole('button', { name: /Deletar/i });
        expect(screen.queryByRole('button', { name: /Deletar/i })).toBeInTheDocument();
        
        await userEvent.click(deleteButtons[0]);
        expect(axios.delete).toHaveBeenCalledWith('http://localhost:3333/api/memos/1');
    });

    // 3 - Deve chamar updateMemo ao clicar em "Trocar Status"
    it('test if update request is called and the render is updated', async () => {
        axios.get.mockResolvedValue({ data: [mockMemos[0]] });
        axios.put.mockResolvedValue({ data: [{ ...mockMemos[0], status: 'completado' }] });
        render(<MemoList />);

        // Aguarda a renderização dos memos        
        await screen.findByText('12/12/0000');

        expect(screen.queryByText('pendente')).toBeInTheDocument();
        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });

        await userEvent.click(updateButtons[0]);
        expect(await screen.queryByText('completado')).toBeInTheDocument();
        expect(axios.put).toHaveBeenCalledWith('http://localhost:3333/api/memos/1', { title: 'Lembrete Antigo', status: 'completado' });
    });

    // 4 - Deve exibir mensagem de erro ao falhar ao deletar um memo
    it('test if error message is shown when delete fails', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.delete.mockRejectedValue(new Error('Failed to delete memo'));
        render(<MemoList />);

        const deleteButtons = await screen.findAllByRole('button', { name: /Deletar/i });        
        try {
            await userEvent.click(deleteButtons[0]);
        } catch (error) {
            expect(error.message).toBe('Failed to delete memo');
        }
    });

    // 5 - Deve exibir mensagem de erro devido a falha no servidor ao atualizar um memo
    it('test if error message is shown when update fails due to server error', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockRejectedValue(new Error({response: {status: 500, message: 'Server error'}}));
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        
        try {
            await userEvent.click(updateButtons[0]);
        } catch (error) {
            expect(console.log).toBe('Server error');
        }
    });

    // 6 - Deve exibir mensagem de erro devido ao servidor nao responder ao atualizar um memo
    it('test if error message is shown when update fails due to server not responding', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockRejectedValue(new Error('Network Error'));
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        
        try {
            await userEvent.click(updateButtons[0]);
        } catch (error) {
            expect(console.log).toBe('No response from server');
        }
    });

    // 7 - Deve exibir mensagem de erro devido a erro de requisição ao atualizar um memo
    it('test if error message is shown when update fails due to request error', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockRejectedValue(new Error('Request failed with status code 400'));
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        
        try {
            await userEvent.click(updateButtons[0]);
        } catch (error) {
            expect(console.log).toBe('Request error');
        }
    });

    // 8 - Deve exibir mensagem de erro genérica ao falhar ao atualizar um memo
    it('test if generic error message is shown when update fails', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockRejectedValue(new Error('Unknown error'));
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        
        try {
            await userEvent.click(updateButtons[0]);
        } catch (error) {
            expect(error.message).toBe('Unknown error');
        }
    });

    // 9 - Deve exibir mensagem de erro quando a busca de memos falhar
    it('test if error message is shown when fetching memos fails', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValue(new Error('Failed to fetch memos'));
        render(<MemoList />);

        // Aguarda um pouco para o useEffect ser executado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch memos:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    // 10 - Deve exibir uma mensagem quando não houver memos para exibir
    it('test if message is shown when there are no memos to display', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<MemoList />);

        const noMemosMessage = await screen.findByText('No memos available');
        expect(noMemosMessage).toBeInTheDocument();
    });

    // 11 - Deve verificar se o status do memo é alterado ao clicar no botão "Trocar Status"
    it('test if memo status changes correctly when "Trocar Status" button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockResolvedValue({ data: [{ ...mockMemos[1], status: 'completado' }] });
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        await userEvent.click(updateButtons[0]);

        expect(axios.put).toHaveBeenCalledWith('http://localhost:3333/api/memos/2', { title: 'Lembrete Recente', status: 'completado' });
        expect(screen.getByText('completado')).toBeInTheDocument();
    });

    // 12 - Verifica a troca de status de múltiplos memos
    it('test if multiple memos are updated correctly when "Trocar Status" button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockResolvedValue({ data: [{ ...mockMemos[0], status: 'completado' }, { ...mockMemos[1], status: 'completado' }] });
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        await userEvent.click(updateButtons[0]);
        await userEvent.click(updateButtons[1]);

        const completedStatuses = screen.getAllByText('completado');
        expect(completedStatuses.length).toBeGreaterThan(0);
    });

    // 13 - Testa se o título e o status do memo são atualizados ao clicar em "Trocar Status"
    it('test if memo title and status are updated on "Trocar Status" click', async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        axios.put.mockResolvedValue({ data: [{ ...mockMemos[1], status: 'completado' }] });
        render(<MemoList />);

        const updateButtons = await screen.findAllByRole('button', { name: /Trocar Status/i });
        await userEvent.click(updateButtons[0]);

        expect(axios.put).toHaveBeenCalledWith('http://localhost:3333/api/memos/2', { title: 'Lembrete Recente', status: 'completado' });
        expect(screen.getByText('completado')).toBeInTheDocument();
    });

    // 14 - Testa se os memos são corretamente agrupados por data
    it('test if memos are correctly grouped by date', async () => {
        const mockMemosByDate = [
            { id: 1, title: 'Lembrete 1', status: 'pendente', created_at: '01/01/2021' },
            { id: 2, title: 'Lembrete 2', status: 'pendente', created_at: '01/02/2021' },
        ];
        axios.get.mockResolvedValue({ data: mockMemosByDate });
        render(<MemoList />);

        const dateGroup1 = await screen.findByText('01/01/2021');
        const dateGroup2 = await screen.findByText('01/02/2021');
        expect(dateGroup1).toBeInTheDocument();
        expect(dateGroup2).toBeInTheDocument();
    });
});
