import { useState } from "react";
import { Modal } from "../../../components/Modal/Modal";
import type { Category } from "../../../services/types";
import styles from "../styles/CategoryModal.module.css";

const DEFAULT_COLORS = [
    "#6c63ff",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
    "#14b8a6",
];
const DEFAULT_ICONS = [
    "🍔",
    "🚌",
    "💡",
    "🎬",
    "👗",
    "📚",
    "❤️",
    "📦",
    "💼",
    "💻",
    "📈",
    "🏠",
];

interface CategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSubmit: (
        name: string,
        category_type: string,
        icon: string,
        color: string,
    ) => void;
}

export function CategoryModal({
    category,
    onClose,
    onSubmit,
}: CategoryModalProps) {
    const isEdit = !!category;
    const [name, setName] = useState(category?.name || "");
    const [category_type, setCategoryType] = useState(
        category?.category_type || "expense",
    );
    const [icon, setIcon] = useState(category?.icon || "📦");
    const [color, setColor] = useState(category?.color || "#6c63ff");

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name, category_type, icon, color);
    };

    const descLen = name.length;

    const footer = (
        <>
            <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
                Guardar
            </button>
        </>
    );

    return (
        <Modal
            title={isEdit ? "Editar categoría" : "Nueva categoría"}
            onClose={onClose}
            footer={footer}
        >
            {!isEdit && (
                <div className={styles.typeToggle}>
                    <button
                        className={`${styles.typeBtn} ${styles.expense} ${category_type === "expense" ? styles.selected : ""}`}
                        onClick={() => setCategoryType("expense")}
                    >
                        ↘ Gasto
                    </button>
                    <button
                        className={`${styles.typeBtn} ${styles.income} ${category_type === "income" ? styles.selected : ""}`}
                        onClick={() => setCategoryType("income")}
                    >
                        ↗ Ingreso
                    </button>
                </div>
            )}
            <div className="form-group">
                <label className="form-label">
                    Nombre
                    <span
                        className={`char-counter${descLen > 15 ? " warn" : ""}`}
                    >
                        {descLen}/20
                    </span>
                </label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Ej: Comida"
                    value={name}
                    maxLength={20}
                    disabled={category?.name === "Sin categoría"}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ícono</label>
                    <div className={styles.picker}>
                        {DEFAULT_ICONS.map((option_icon) => (
                            <button
                                key={option_icon}
                                className={`${styles.iconBtn} ${icon === option_icon ? styles.iconSelected : ""}`}
                                onClick={() => setIcon(option_icon)}
                            >
                                {option_icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Color</label>
                    <div className={styles.picker}>
                        {DEFAULT_COLORS.map((option_color) => (
                            <button
                                key={option_color}
                                className={styles.colorBtn}
                                style={{
                                    background: option_color,
                                    border:
                                        color === option_color
                                            ? "3px solid white"
                                            : "3px solid transparent",
                                    outline:
                                        color === option_color
                                            ? `2px solid ${option_color}`
                                            : "none",
                                }}
                                onClick={() => setColor(option_color)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
