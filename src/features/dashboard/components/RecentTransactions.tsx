import { NavLink } from "react-router-dom";
import { formatARS, formatDate } from "../../../services/types";
import type { Category, Transaction } from "../../../services/types";
import styles from "../styles/RecentTransactions.module.css";

interface RecentTransactionsProps {
    transactions: Transaction[];
    categories: Category[];
}

export function RecentTransactions({
    transactions,
    categories,
}: RecentTransactionsProps) {
    const getIcon = (category_name: string | null, type: string): string => {
        const icon = categories.find((c) => c.name === category_name)?.icon;
        if (icon) return icon;
        return type === "income" ? "💰" : "🛒";
    };
    return (
        <div>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>
                    Transacciones Recientes
                </span>
                <NavLink to="/transactions" className={styles.sectionLink}>
                    <span>Ver todo →</span>
                </NavLink>
            </div>

            {transactions.length === 0 ? (
                <p className={styles.empty}>
                    No hay transacciones. ¡Empezá registrando uno!
                </p>
            ) : (
                <div className={styles.list}>
                    {transactions.map((tx) => (
                        <div key={tx.id} className={styles.item}>
                            <div
                                className={`${styles.iconWrap} ${styles[tx.transaction_type]}`}
                            >
                                {getIcon(tx.category_name, tx.transaction_type)}
                            </div>
                            <div className={styles.info}>
                                <div className={styles.name}>
                                    {tx.description ||
                                        tx.category_name ||
                                        "Sin descripción"}
                                </div>
                                <div className={styles.meta}>
                                    {formatDate(tx.date)}
                                    {tx.account_name
                                        ? ` · ${tx.account_name}`
                                        : ""}
                                </div>
                            </div>
                            <span
                                className={`${styles.amount} ${styles[tx.transaction_type]}`}
                            >
                                {tx.transaction_type === "income" ? "+" : "-"}
                                {formatARS(tx.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
