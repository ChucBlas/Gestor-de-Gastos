import { useEffect, useState } from "react";
import { useAppContext } from "../../../services/AppContext";
import type {
    CategorySummary,
    PeriodBalance,
    MonthlyData,
} from "../../../services/types";
import { reportsService } from "../services/reportsService";

export type Period = "day" | "week" | "month" | "year" | "custom";

function getPeriodDates(
    period: Period,
    multiplier: number,
    from?: string,
    to?: string,
): [string, string] {
    const now = new Date();
    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    if (period === "custom" && from && to) return [from, to];
    if (period === "day") {
        const d = new Date(now);
        d.setDate(d.getDate() + multiplier);
        return [formatDate(d), formatDate(d)];
    }
    if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() + 7 * multiplier);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return [formatDate(start), formatDate(end)];
    }
    if (period === "month") {
        const d = new Date(now.getFullYear(), now.getMonth() + multiplier, 1);
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        return [formatDate(d), formatDate(nextMonth)];
    }
    const year = now.getFullYear() + multiplier;
    return [`${year}-01-01`, `${year}-12-31`];
}

export function useReports() {
    const { accounts } = useAppContext();

    const [period, setPeriod] = useState<Period>("month");
    const [multiplier, setMultiplier] = useState(0);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedAccountId, setSelectedAccountId] = useState<
        number | undefined
    >(undefined);
    const [year] = useState(new Date().getFullYear());

    const [periodBalance, setPeriodBalance] = useState<PeriodBalance>({
        total_income: 0,
        total_expense: 0,
        net: 0,
    });
    const [categorySummary, setCategorySummary] = useState<CategorySummary[]>(
        [],
    );
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

    const load = async () => {
        const [from, to] = getPeriodDates(period, multiplier, dateFrom, dateTo);
        const periodBalance = await reportsService.getPeriodBalance(
            from,
            to,
            selectedAccountId,
        );
        setPeriodBalance(periodBalance);

        setCategorySummary(
            await reportsService.getCategorySummary(
                from,
                to,
                selectedAccountId,
            ),
        );

        const monthlyData = await reportsService.getMonthlyData(
            year,
            selectedAccountId,
        );
        setMonthlyData(monthlyData);
    };

    useEffect(() => {
        load();
        window.addEventListener("transaction-saved", load);
        return () => window.removeEventListener("transaction-saved", load);
    }, [period, multiplier, dateFrom, dateTo, selectedAccountId]);

    const balance = periodBalance;

    const expenseCategories: CategorySummary[] = categorySummary.filter(
        (c) => c.category_type === "expense",
    );
    const incomeCategories: CategorySummary[] = categorySummary.filter(
        (c) => c.category_type === "income",
    );

    return {
        period,
        setPeriod,
        setMultiplier,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        balance,
        expenseCategories,
        incomeCategories,
        monthlyData,
        year,
    };
}
