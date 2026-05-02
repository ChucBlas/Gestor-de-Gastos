import { invoke } from "@tauri-apps/api/core";
import type {
    Account,
    CreateAccountInput,
    UpdateAccountInput,
} from "../../../services/types";

export const accountsService = {
    getAll: () => invoke<Account[]>("get_accounts"),
    create: (data: CreateAccountInput) =>
        invoke<Account>("create_account", { data }),
    edit: (id: number, data: UpdateAccountInput) =>
        invoke<Account>("update_account", { id, data }),
    delete: (id: number) => invoke<void>("delete_account", { id }),
};
