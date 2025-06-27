import axios from 'axios';
import memoService from '../src/services/memoService';
import { vi, describe, afterEach, it, expect } from 'vitest';

vi.mock('axios');

const baseURL = 'http://localhost:3333/api/memos';

describe('memoService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    // 1 - Teste para buscar todos os memos
    it('test getAllMemos returning all memos', async () => {
        const mockData = [
            { id: 1, text: 'Test memo' },
            { id: 2, text: 'Another memo' },
            { id: 3, text: 'Yet another memo' },
            { id: 4, text: 'And yet another memo' },
            { id: 5, text: 'Final memo' }
        ];
        axios.get.mockResolvedValue({ data: mockData });

        const result = await memoService.getAllMemos();

        expect(axios.get).toHaveBeenCalledWith(baseURL);
        expect(result).toEqual(mockData);
    });

    // 2 - Teste para criar um novo memo
    it('test createMemo returning a new memo', async () => {
        const newMemo = { id: 1, data: { title: 'New Memo', created_at: '25/12/2025' } };

        axios.post.mockResolvedValue(newMemo);

        const result = await memoService.createMemo(newMemo);

        expect(axios.post).toHaveBeenCalledWith(baseURL, newMemo);
        expect(result).toEqual(newMemo.data);
    });

    // 3 - Teste para deletar um memo com id correto
    it('test deleteMemo with correct id', async () => {
        const memoId = 1;

        const result = await memoService.deleteMemo(memoId);

        expect(axios.delete).toHaveBeenCalledWith(`${baseURL}/${memoId}`);
        expect(axios.delete).toHaveBeenCalledTimes(1);
    });

    // 4 - Teste para atualizar um memo com id correto
    it('test updateMemo with correct id', async () => {
        const memoId = 1;
        const updatedMemo = { title: 'Updated Memo', status: "pendente", statusCode: "200" };

        axios.put.mockResolvedValue({ data: updatedMemo });

        const result = await memoService.updateMemo(memoId, updatedMemo);

        expect(axios.put).toHaveBeenCalledWith(`${baseURL}/${memoId}`, updatedMemo);
        expect(result).toEqual(updatedMemo);
    });

    // 5 - deve exibir mensagem de erro devido a falha no servidor ao atualizar um memo
    it("test if error message is shown when update fails due to server error", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        const memoId = 1;
        const updatedMemo = { title: 'Updated Memo', status: "pendente", statusCode: "200" };

        const server500 = {
            isAxiosError: true,
            response: { data: 500 },
        };
        axios.put.mockRejectedValue(server500);
        try {
            await memoService.updateMemo(1);
        } catch (error) { }

        expect(errorSpy).toBeCalled();
        expect(errorSpy).toHaveBeenCalledWith("Server Error:", 500);

        errorSpy.mockRestore();
    });

    // 6 - deve exibir mensagem de erro devido ao servidor nao responder ao atualizar um memo
    it("test if error message is shown when update fails due to server not responding", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        const axiosNoResponse = {
            isAxiosError: true,
            request: { status: 0 }, // 'request' existe
            response: undefined, // 'response' não existe
            message: "Network Error",
        };
        axios.put.mockRejectedValue(axiosNoResponse);
        try {
            await memoService.updateMemo(1);
        } catch (error) { }

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith("No response from server:", expect.any(Object),);

        errorSpy.mockRestore();
    });

    // 7 - deve exibir mensagem de erro devido a erro de requisição ao atualizar um memo
    it("test if error message is shown when update fails due to request error", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        axios.put.mockRejectedValue(new Error("Request failed with status code 400"));
        try {
            await memoService.updateMemo(1);
        } catch (error) { }

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith("Request error:", "Request failed with status code 400");

        errorSpy.mockRestore();
    });

    // 8 - deve exibir mensagem de erro genérica ao falhar ao atualizar um memo
    it("test if generic error message is shown when update fails", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        axios.put.mockRejectedValue(new Error("Unknown error"));
        try {
            await memoService.updateMemo(1);
        } catch (error) { }

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith("Request error:", "Unknown error");

        errorSpy.mockRestore();
    });

    // 9 - deve exibir mensagem de erro genérica ao falhar ao atualizar um memo
    it("test if generic error message is shown when update fails", async () => {
        axios.get.mockRejectedValue(new Error("Catch Error"));
        
        await expect(memoService.getAllMemos()).rejects.toThrowError('Failed to fetch memos');
    });


});