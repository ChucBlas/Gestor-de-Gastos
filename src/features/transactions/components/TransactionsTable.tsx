import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { TransactionRow } from "./TransactionRow";
import type { Transaction } from "../../../services/types";
import styles from "../styles/TransactionsTable.module.css";

interface TransactionsTableProps {
    transactions: Transaction[];
    loading: boolean;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: number) => void;
}

export function TransactionsTable({
    transactions,
    loading,
    onEdit,
    onDelete,
}: TransactionsTableProps) {

    if (loading) return <EmptyState icon="⏳" message="Cargando..." />;

    if (transactions.length === 0) {
        return (
            <EmptyState
            icon="💸"
            message="No hay transacciones. ¡Registrá el primero!"
            />
        );
    }
        
    const isMobile = window.innerWidth <= 700;

    return (
        <div className={styles.wrap}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.titles}>
                        <th className={styles.titles}>Fecha</th>
                        {!isMobile && (
                            <>
                                <th className={styles.titles}>Descripción</th>
                                <th className={styles.titles}>Cuenta</th>
                            </>
                        )}
                        <th className={styles.titles}>Categoría</th>
                        <th style={{ textAlign: "right", color: "#FFFFFF" }}>
                            Importe
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <TransactionRow
                            key={tx.id}
                            tx={tx}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
