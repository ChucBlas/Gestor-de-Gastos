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

    const selectedLabel =
        selectedAccountId === undefined
            ? "Todas las cuentas"
            : (accounts.find((a) => a.id === selectedAccountId)?.name ?? "");

    return (
        <>
            <BalanceCard
                balance={data.total_balance}
                income={data.month_income}
                expense={data.month_expense}
                label={selectedLabel}
                monthName={monthNameCap}
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onAccountChange={setSelectedAccountId}
            />
            <RecentTransactions
                transactions={data.recent_transactions}
                categories={categories}
            />
        </>
    );
}
