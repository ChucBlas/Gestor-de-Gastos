import { invoke } from "@tauri-apps/api/core";
import type {
    PeriodBalance,
    CategorySummary,
    MonthlyData,
} from "../../../services/types";

export const reportsService = {
    getPeriodBalance: (dateFrom: string, dateTo: string, accountId?: number) =>
        invoke<PeriodBalance>("get_period_balance", {
            dateFrom,
            dateTo,
            accountId,
        }),
    getCategorySummary: (
        dateFrom: string,
        dateTo: string,
        accountId?: number,
    ) =>
        invoke<CategorySummary[]>("get_category_summary", {
            dateFrom,
            dateTo,
            accountId,
        }),
    getMonthlyData: (year: number, accountId?: number) =>
        invoke<MonthlyData[]>("get_monthly_data", { year, accountId }),
};
