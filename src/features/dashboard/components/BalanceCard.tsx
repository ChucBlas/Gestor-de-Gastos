import { extendFormatARS, formatARS } from "../../../services/types";
import type { Account } from "../../../services/types";
import styles from "../styles/BalanceCard.module.css";

interface BalanceCardProps {
    balance: number;
    income: number;
    expense: number;
    label: string;
    monthName: string;
    accounts: Account[];
    selectedAccountId: number | undefined;
    onAccountChange: (id: number | undefined) => void;
}

export function BalanceCard({
    balance,
    income,
    expense,
    label,
    monthName,
    accounts,
    selectedAccountId,
    onAccountChange,
}: BalanceCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.accountFilter}>
                <select
                    className="form-select account-select"
                    value={selectedAccountId}
                    onChange={(e) =>
                        onAccountChange(
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
            <div className={styles.balanceLabel}>Balance · {label}</div>
            <div className={styles.balanceAmount}>
                {extendFormatARS(balance)}
            </div>
            <div className={styles.balanceSubtitle}>{monthName}</div>
            <div className={styles.row}>
                <div className={styles.mini}>
                    <span className={styles.miniLabel}>↑ Ingresos del mes</span>
                    <span className={`${styles.miniVal} ${styles.income}`}>
                        {formatARS(income)}
                    </span>
                </div>
                <div className={`${styles.mini} ${styles.right}`}>
                    <span className={styles.miniLabel}>↓ Gastos del mes</span>
                    <span className={`${styles.miniVal} ${styles.expenseVal}`}>
                        {formatARS(expense)}
                    </span>
                </div>
            </div>
        </div>
    );
}
