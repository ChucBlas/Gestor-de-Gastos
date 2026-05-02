import { useDashboard } from "../hooks/useDashboard";
import { BalanceCard } from "./BalanceCard";
import { RecentTransactions } from "./RecentTransactions";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import type { Transaction } from "../../../services/types";

export default function Dashboard() {
    const {
        data,
        accounts,
        loading,
        selectedAccountId,
        categories,
        setSelectedAccountId,
    } = useDashboard();

    if (loading) return <EmptyState icon="⏳" message="Cargando..." />;
    if (!data) return null;

    const now = new Date();
    const monthName = now.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
    });
    const monthNameCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const filteredTx: Transaction[] =
        selectedAccountId === "all"
            ? data.recent_transactions
            : data.recent_transactions.filter(
                  (tx) => tx.account_id === selectedAccountId,
              );

    let displayBalance: number;
    let displayIncome: number;
    let displayExpense: number;

    if (selectedAccountId === "all") {
        displayBalance = data.total_balance;
        displayIncome = data.month_income;
        displayExpense = data.month_expense;
    } else {
        const acc = accounts.find((a) => a.id === selectedAccountId);
        displayBalance = acc?.balance ?? 0;
        displayIncome = filteredTx
            .filter((t) => t.transaction_type === "income")
            .reduce((s, t) => s + t.amount, 0);
        displayExpense = filteredTx
            .filter((t) => t.transaction_type === "expense")
            .reduce((s, t) => s + t.amount, 0);
    }

    const selectedLabel =
        selectedAccountId === "all"
            ? "Todas las cuentas"
            : (accounts.find((a) => a.id === selectedAccountId)?.name ?? "");

    return (
        <>
            <BalanceCard
                balance={displayBalance}
                income={displayIncome}
                expense={displayExpense}
                label={selectedLabel}
                monthName={monthNameCap}
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onAccountChange={setSelectedAccountId}
            />
            <RecentTransactions
                transactions={filteredTx}
                categories={categories}
            />
        </>
    );
}
