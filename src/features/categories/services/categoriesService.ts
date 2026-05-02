import { invoke } from "@tauri-apps/api/core";
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../../../services/types";

export const categoriesService = {
    getAll: () => invoke<Category[]>("get_categories"),
    create: (data: CreateCategoryInput) =>
        invoke<Category>("create_category", { data }),
    update: (id: number, data: UpdateCategoryInput) =>
        invoke<Category>("update_category", { id, data }),
    delete: (id: number) => invoke<void>("delete_category", { id }),
};
