import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { accountsService } from "../features/accounts/services/accountsService";
import { categoriesService } from "../features/categories/services/categoriesService";
import { dashboardService } from "../features/dashboard/services/dashboardService";
import { transactionsService } from "../features/transactions/services/transactionsService";
import type { Account, Category, DashboardSummary, Transaction } from "./types";

export interface AppContextValue {
    accounts: Account[];
    categories: Category[];
    dashboardData: DashboardSummary | null;
    transactions: Transaction[];

    bootstrapping: boolean;

    refreshAccounts: () => Promise<void>;
    refreshCategories: () => Promise<void>;
    refreshDashboard: () => Promise<void>;
    refreshTransactions: () => Promise<void>;

    cents: boolean;
    toggleCents: (val: boolean) => void;

    refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx)
        throw new Error("useAppContext must be used inside <AppProvider>");
    return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
        null,
    );
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [bootstrapping, setBootstrapping] = useState(true);

    const [cents, setCentsState] = useState<boolean>(() => {
        const val = localStorage.getItem("viewCents");
        return val === null ? true : val === "true";
    });

    const toggleCents = useCallback((val: boolean) => {
        setCentsState(val);
        localStorage.setItem("viewCents", String(val));
    }, []);

    const refreshAccounts = useCallback(async () => {
        setAccounts(await accountsService.getAll());
    }, []);

    const refreshCategories = useCallback(async () => {
        setCategories(await categoriesService.getAll());
    }, []);

    const refreshDashboard = useCallback(async () => {
        setDashboardData(await dashboardService.getSummary());
    }, []);

    const refreshTransactions = useCallback(async () => {
        setTransactions(await transactionsService.getAll(200));
    }, []);

    const refreshAll = useCallback(async () => {
        await Promise.all([
            refreshAccounts(),
            refreshDashboard(),
            refreshTransactions(),
        ]);
        window.dispatchEvent(new CustomEvent("transaction-saved"));
    }, [refreshAccounts, refreshDashboard, refreshTransactions]);

    // Inicio una vez que arranca la app
    useEffect(() => {
        Promise.all([
            accountsService.getAll(),
            categoriesService.getAll(),
            dashboardService.getSummary(),
            transactionsService.getAll(200),
        ]).then(([accs, cats, dash, movs]) => {
            setAccounts(accs);
            setCategories(cats);
            setDashboardData(dash);
            setTransactions(movs);
            setBootstrapping(false);
        });
    }, []);

    return (
        <AppContext.Provider
            value={{
                accounts,
                categories,
                dashboardData,
                transactions,
                bootstrapping,
                cents,
                toggleCents,
                refreshAccounts,
                refreshCategories,
                refreshDashboard,
                refreshTransactions,
                refreshAll,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
