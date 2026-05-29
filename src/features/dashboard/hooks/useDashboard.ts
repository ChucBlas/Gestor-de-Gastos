import { useAppContext } from "../../../services/AppContext";
import { useEffect, useState } from "react";
import { DashboardSummary } from "../../../services/types";
import { dashboardService } from "../services/dashboardService";

export function useDashboard() {
    const {
        dashboardData: data,
        accounts,
        bootstrapping: loading,
        categories,
    } = useAppContext();
    const [selectedAccountId, setSelectedAccountId] = useState<
        number | undefined
    >(undefined);

    const [actualData, setActualData] = useState<DashboardSummary | null>(data);
    console.log("Dashboard data from context:", data);

    const load = async () => {
        const newData = await dashboardService.getSummary(selectedAccountId);
        setActualData(newData);
    };

    useEffect(() => {
        load();
    }, [selectedAccountId]);

    return {
        data: actualData,
        accounts,
        loading,
        selectedAccountId,
        categories,
        setSelectedAccountId,
    };
}
