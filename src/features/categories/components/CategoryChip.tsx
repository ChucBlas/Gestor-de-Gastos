import { useState } from "react";
import type { Category } from "../../../services/types";
import styles from "../styles/CategoryChip.module.css";
import { DeleteWindow } from "../../../components/ConfirmWindow/DeleteWindow";

interface CategoryChipProps {
    category: Category;
    onDelete: (id: number) => void;
    onEdit: (category: Category) => void;
}

export function CategoryChip({
    category,
    onDelete,
    onEdit,
}: CategoryChipProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className={styles.chip}>
            <span
                className={styles.dot}
                style={{ background: category.color ?? "var(--text-dim)" }}
            />
            <span className={styles.icon}>{category.icon}</span>
            <span className={styles.name}>{category.name}</span>

            <div className={styles.buttons}>
                {category.name !== "Sin categoría" && (
                    <button
                        className={styles.option}
                        onClick={() => onEdit(category)}
                    >
                        ✏️
                    </button>
                )}
                {category.name !== "Sin categoría" && (
                    <button
                        className={styles.option}
                        onClick={() => setShowConfirm(true)}
                    >
                        ×
                    </button>
                )}
            </div>

            {showConfirm && (
                <DeleteWindow
                    title={undefined}
                    onSubmit={() => {
                        setShowConfirm(false);
                        onDelete(category.id);
                    }}
                    onCancel={() => setShowConfirm(false)}
                    children={`¿Eliminar la categoría ${category.name}?`}
                />
            )}
        </div>
    );
}
