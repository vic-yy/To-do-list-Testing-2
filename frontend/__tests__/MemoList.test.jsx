import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import MemoList from "../src/components/MemoList";

vi.mock('axios');

const mockMemos = [
    {
        id: 1,
        title: "Lembrete Antigo",
        status: "pendente",
        created_at: "12/12/0000",
    },
    {
        id: 2,
        title: "Lembrete Recente",
        status: "pendente",
        created_at: "10/05/9999",
    },
];

describe("MemoList", () => {
    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    // 1 - deve renderizar a lista de memos agrupada por data
    it("test if memos are grouped by date", async () => {
        axios.get.mockResolvedValue({ data: mockMemos });
        render(<MemoList />);

        // Aguarda a renderização dos memos
        await screen.findByText("12/12/0000");

        const header = screen.getByText("12/12/0000");
        const memoItem = screen.getByText("Lembrete Antigo");
        expect(
            header.compareDocumentPosition(memoItem) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();

        const header2 = screen.getByText("10/05/9999");
        const memoItem2 = screen.getByText("Lembrete Recente");
        expect(
            header2.compareDocumentPosition(memoItem2) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });

    // 2 - deve chamar deleteMemo ao clicar em "Deletar"
    it('test if Delete button is found and deleteMemo is correctly called"', async () => {
        axios.get.mockResolvedValue({ data: [mockMemos[0]] });
        axios.delete.mockResolvedValue({ status: 204 });
        render(<MemoList />);

        const deleteButtons = await screen.findAllByRole("button", {
            name: /Deletar/i,
        });
        expect(
            screen.queryByRole("button", { name: /Deletar/i })
        ).toBeInTheDocument();

        await userEvent.click(deleteButtons[0]);
        expect(axios.delete).toHaveBeenCalledWith(
            "http://localhost:3333/api/memos/1"
        );
    });

    // 3 - deve chamar updateMemo ao clicar em "Trocar Status"
    it("test if update request is called and the render is updated", async () => {
        axios.get.mockResolvedValue({ data: [mockMemos[0]] });
        axios.put.mockResolvedValue({
            data: [{ ...mockMemos[0], status: "completado" }],
        });
        render(<MemoList />);

        // Aguarda a renderização dos memos
        await screen.findByText("12/12/0000");

        expect(screen.queryByText("pendente")).toBeInTheDocument();
        const updateButtons = await screen.findAllByRole("button", {
            name: /Trocar Status/i,
        });

        await userEvent.click(updateButtons[0]);
        expect(await screen.queryByText("completado")).toBeInTheDocument();
        expect(axios.put).toHaveBeenCalledWith(
            "http://localhost:3333/api/memos/1",
            { title: "Lembrete Antigo", status: "completado" }
        );
    });

    // 4 - deve exibir mensagem de erro ao falhar ao deletar um memo
    it("test if error message is shown when delete fails", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        axios.get.mockResolvedValue({ data: mockMemos });
        axios.delete.mockRejectedValue(new Error("Err DELETE"));
        render(<MemoList />);

        const deleteButtons = await screen.findAllByRole("button", {
            name: /Deletar/i,
        });
        await userEvent.click(deleteButtons[0]);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to delete memo:",
            Error("Err DELETE")
        );

        errorSpy.mockRestore();
    });
});
