import { invoke } from "@tauri-apps/api/core";
import type {
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
} from "../../../services/types";

export const transactionsService = {
    getAll: (limit?: number) =>
        invoke<Transaction[]>("get_transactions", { limit }),
    getByPeriod: (dateFrom: string, dateTo: string) =>
        invoke<Transaction[]>("get_transactions_by_period", {
            dateFrom,
            dateTo,
        }),
    create: (data: CreateTransactionInput) =>
        invoke<Transaction>("create_transaction", { data }),
    update: (id: number, data: UpdateTransactionInput) =>
        invoke<Transaction>("update_transaction", { id, data }),
    delete: (id: number) => invoke<void>("delete_transaction", { id }),
};
