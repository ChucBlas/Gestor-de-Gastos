import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionModal } from "./TransactionModal";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import type { Transaction } from "../../../services/types";

export default function Transactions() {
    const {
        transactions,
        accounts,
        categories,
        loading,
        create,
        update,
        remove,
    } = useTransactions();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);

    const openEdit = (tx: Transaction) => {
        setEditing(tx);
        setShowModal(true);
    };

    if (loading) return <EmptyState icon="⏳" message="Cargando..." />;

    return (
        <>
            <div className="card">
                <TransactionsTable
                    transactions={transactions}
                    onEdit={openEdit}
                    onDelete={remove}
                />
            </div>

            {showModal && (
                <TransactionModal
                    initialType={
                        (editing?.transaction_type as "expense" | "income") ??
                        "expense"
                    }
                    accounts={accounts}
                    categories={categories}
                    editing={editing}
                    onClose={() => setShowModal(false)}
                    onSubmit={async (data) => {
                        await create(data);
                        setShowModal(false);
                    }}
                    onUpdate={async (id, data) => {
                        await update(id, data);
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
}
