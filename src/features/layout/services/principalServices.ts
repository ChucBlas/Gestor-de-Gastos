import { invoke } from "@tauri-apps/api/core";
import { Transaction } from "../../../services/types";

export const principalService = {
    processExcel: (datos: number[], path: string, typeTransaction: string) =>
        invoke<Transaction[]>("process_excel", {
            datos,
            path,
            typeTransaction,
        }),
};
