import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionModal } from "./TransactionModal";
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
        selectedAccountId,
        setSelectedAccountId,
        selectedCategoryId,
        setSelectedCategoryId,
    } = useTransactions();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);

    const openEdit = (tx: Transaction) => {
        setEditing(tx);
        setShowModal(true);
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between"}}>
                <div style={{margin: "12px"}}>
                    <select
                        className="form-select account-select"
                        value={selectedAccountId}
                        onChange={(e) =>
                            setSelectedAccountId(
                                e.target.value === "all"
                                    ? undefined
                                    : parseInt(e.target.value),
                            )
                        }
                    >
                        <option value="all">Todas las cuentas</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{margin: "12px"}}>
                    <select
                        className="form-select account-select"
                        value={selectedCategoryId}
                        onChange={(e) =>
                            setSelectedCategoryId(
                                e.target.value === "all"
                                    ? undefined
                                    : parseInt(e.target.value),
                            )
                        }
                    >
                        <option value="all">Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="card">
                <TransactionsTable
                    transactions={transactions}
                    loading={loading}
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
