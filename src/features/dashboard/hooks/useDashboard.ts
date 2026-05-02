import { useAppContext } from "../../../services/AppContext";
import { useState } from "react";

export function useDashboard() {
    const {
        dashboardData: data,
        accounts,
        bootstrapping: loading,
        categories,
    } = useAppContext();
    const [selectedAccountId, setSelectedAccountId] = useState<number | "all">(
        "all",
    );

    return {
        data,
        accounts,
        loading,
        selectedAccountId,
        categories,
        setSelectedAccountId,
    };
}
