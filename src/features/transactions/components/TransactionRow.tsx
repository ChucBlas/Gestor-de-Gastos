import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/Badge/Badge";
import { formatARS, formatDate } from "../../../services/types";
import type { Transaction } from "../../../services/types";
import styles from "../styles/TransactionRow.module.css";
import { useState } from "react";
import { TransactionInfoModal } from "./TransactionInfoModal";

interface TransactionRowProps {
    tx: Transaction;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: number) => void;
}

export function TransactionRow({ tx, onEdit, onDelete }: TransactionRowProps) {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const isMobile = window.innerWidth <= 768;

    const handleClickRow = () => {
        setShowInfo(true);
    };

    return (
        <tr className={styles.row} onClick={handleClickRow}>
            <td className={styles.date}>{formatDate(tx.date)}</td>
            {!isMobile && (
                <>
                    <td>
                        {tx.description || (
                            <span className={styles.dim}>Sin descripción</span>
                        )}
                    </td>
                    <td className={styles.muted}>{tx.account_name}</td>
                </>
            )}
            <td>
                {tx.category_name && tx.category_id != null ? (
                    <Badge
                        label={tx.category_name}
                        variant={tx.transaction_type as "expense" | "income"}
                        clickable
                        onClick={() =>
                            navigate(
                                `/transactions/category/${tx.category_id}/${encodeURIComponent(tx.category_name!)}`,
                                { state: { categoryName: tx.category_name, initialData: tx } } // <--- Pasamos el dato aquí
                            )
                        }
                    />
                ) : (
                    <span className={styles.dim}>—</span>
                )}
            </td>
            <td
                className={`${styles.amount} ${tx.transaction_type === "income" ? styles.income : styles.expense}`}
            >
                {tx.transaction_type === "income" ? "+" : "-"}
                {formatARS(tx.amount)}
            </td>
            {showInfo && (
                <TransactionInfoModal
                    tx={tx}
                    showConfirm={showConfirm}
                    onClose={() => setShowInfo(false)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    setShowConfirm={setShowConfirm}
                />
            )}
        </tr>
    );
}
