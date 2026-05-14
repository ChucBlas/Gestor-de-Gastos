import { useCategories } from "../hooks/useCategories";
import { CategoryChip } from "./CategoryChip";
import { CategoryModal } from "./CategoryModal";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { useState } from "react";
import { firstSinCategoria } from "../../../services/types";

export default function Categories() {
    const {
        categories,
        showModal,
        editingCategory,
        openNewCategoryModal,
        openEditCategoryModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useCategories();

    const [isOpenExpense, setIsOpenExpense] = useState(false);
    const [isOpenIncome, setIsOpenIncome] = useState(false);

    const expenses = firstSinCategoria(categories, "expense");
    const incomes = firstSinCategoria(categories, "income");

    const isMobile = window.innerWidth <= 700;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Categorías</h1>
                <button
                    className="btn btn-primary"
                    onClick={openNewCategoryModal}
                >
                    ＋ Nueva categoría
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Gastos</div>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsOpenExpense(!isOpenExpense)}
                        >
                            {isOpenExpense ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>
                {expenses.length === 0 ? (
                    <EmptyState
                        icon="📂"
                        message="No hay categorías de gasto."
                    />
                ) : (
                    isOpenExpense && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: isMobile ? "column" : "row",
                            }}
                        >
                            {expenses.map((cat) => (
                                <CategoryChip
                                    key={cat.id}
                                    category={cat}
                                    onDelete={handleDelete}
                                    onEdit={openEditCategoryModal}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Ingresos</div>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsOpenIncome(!isOpenIncome)}
                        >
                            {isOpenIncome ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>
                {incomes.length === 0 ? (
                    <EmptyState
                        icon="📂"
                        message="No hay categorías de ingreso."
                    />
                ) : (
                    isOpenIncome && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: isMobile ? "column" : "row",
                            }}
                        >
                            {incomes.map((cat) => (
                                <CategoryChip
                                    key={cat.id}
                                    category={cat}
                                    onDelete={handleDelete}
                                    onEdit={openEditCategoryModal}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
}
