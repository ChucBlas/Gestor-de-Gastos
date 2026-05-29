import { invoke } from "@tauri-apps/api/core";
import type { DashboardSummary } from "../../../services/types";

export const dashboardService = {
    getSummary: (accountId?: number) =>
        invoke<DashboardSummary>("get_dashboard_summary", { accountId }),
};
