import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategoryTransactions } from "../hooks/useCategoryTransactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionModal } from "./TransactionModal";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { formatARS } from "../../../services/types";
import type { Transaction } from "../../../services/types";
import styles from "../styles/CategoryTransactions.module.css";

export default function CategoryTransactions() {
    const { id, name } = useParams<{ id: string; name: string }>();
    const categoryId = id ? parseInt(id) : null;
    const categoryName = name ? decodeURIComponent(name) : "Categoría";

    const { transactions, accounts, categories, loading, update, remove } =
        useCategoryTransactions(categoryId);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);

    const openEdit = (tx: Transaction) => {
        setEditing(tx);
        setShowModal(true);
    };

    const total = transactions.reduce(
        (s, t) =>
            t.transaction_type === "expense" ? s - t.amount : s + t.amount,
        0,
    );

    if (loading) return <EmptyState icon="⏳" message="Cargando..." />;

    return (
        <>
            <div className={styles.summary}>
                <span className={styles.summaryLabel}>
                    <strong>{transactions.length}</strong> transacción
                    {transactions.length !== 1 ? "s" : ""} en&nbsp;
                    <strong>{categoryName}</strong>
                </span>
                <span
                    className={`${styles.total} ${total >= 0 ? styles.income : styles.expense}`}
                >
                    {total >= 0 ? "+" : ""}
                    {formatARS(total)}
                </span>
            </div>

            <div className="card">
                {/* No se debería llegar nunca al caso de transactions.length === 0, salvo que sea forzado. */}
                {transactions.length === 0 ? (
                    <EmptyState
                        icon="📭"
                        message="No hay transacciones para esta categoría."
                    />
                ) : (
                    <TransactionsTable
                        transactions={transactions}
                        onEdit={openEdit}
                        onDelete={remove}
                    />
                )}
            </div>

            {showModal && editing && (
                <TransactionModal
                    initialType={
                        editing.transaction_type as "expense" | "income"
                    }
                    accounts={accounts}
                    categories={categories}
                    editing={editing}
                    onClose={() => setShowModal(false)}
                    onUpdate={async (id, data) => {
                        await update(id, data);
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
}
