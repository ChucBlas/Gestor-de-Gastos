import { useAppContext } from "../../../services/AppContext";
import { categoriesService } from "../services/categoriesService";
import { useState } from "react";
import type { Category } from "../../../services/types";

export function useCategories() {
    const { categories, refreshCategories } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    const openNewCategoryModal = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const openEditCategoryModal = (category: Category) => {
        setEditingCategory(category);
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleSubmit = async (
        name: string,
        category_type: string,
        icon: string,
        color: string,
    ) => {
        if (!name.trim()) return;
        if (editingCategory) {
            await categoriesService.update(editingCategory.id, {
                name,
                category_type,
                icon,
                color,
            });
        } else {
            await categoriesService.create({
                name,
                category_type,
                icon,
                color,
            });
        }
        await refreshCategories();
        closeModal();
    };

    const handleDelete = async (id: number) => {
        await categoriesService.delete(id);
        await refreshCategories();
        closeModal();
    };

    return {
        categories,
        showModal,
        editingCategory,
        openNewCategoryModal,
        openEditCategoryModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
}
