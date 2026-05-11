import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { transactionsService } from "../../transactions/services/transactionsService";
import { BottomNav } from "./BottomNav";
import { SettingsSidebar } from "./SettingsSidebar";
import { TransactionModal } from "../../transactions/components/TransactionModal";
import { AppProvider, useAppContext } from "../../../services/AppContext";
import type { CreateTransactionInput } from "../../../services/types";
import styles from "../styles/Layout.module.css";

const PAGE_TITLES: Record<string, string> = {
    "/": "Mis Finanzas",
    "/transactions": "Transacciones",
    "/accounts": "Cuentas",
    "/categories": "Categorías",
    "/reports": "Reportes",
};

function getTitle(path: string): string {
    if (path.startsWith("/transactions/category/"))
        return "Transacciones por Categoría";
    return PAGE_TITLES[path] ?? "GestorGastos";
}

const PRIMARY_ROUTES = [
    "/transactions",
    "/accounts",
    "/categories",
    "/reports",
];

function getHeaderState(path: string): "home" | "primary" | "secondary" {
    if (path === "/") return "home";
    if (PRIMARY_ROUTES.includes(path)) return "primary";
    return "secondary";
}

// ── Inner component — has access to AppContext ────────────────────────────────
function LayoutInner() {
    const navigate = useNavigate();
    const title = getTitle(location.pathname);
    const headerState = getHeaderState(location.pathname);

    const { accounts, categories, refreshAll, cents } = useAppContext();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleCreate = async (formData: CreateTransactionInput) => {
        if (!formData.amount || !formData.account_id) return;
        await transactionsService.create({
            ...formData,
            category_id: formData.category_id || undefined,
        });
        setShowAddModal(false);
        await refreshAll();
    };

    const handleOpenModal = () => {
        setShowAddModal(true);
    }

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    {headerState === "home" && (
                        <div className={styles.avatar}>GG</div>
                    )}
                    {headerState === "primary" && (
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate("/")}
                            title="Volver"
                        >
                            <div className="icon-arrow icon-left" style={{backgroundColor: "#132a20"}}/>
                        </button>
                    )}
                    {headerState === "secondary" && (
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate(-1)}
                            title="Volver"
                        >
                            <div className="icon-arrow icon-left" style={{backgroundColor: "#132a20"}}/>
                        </button>
                    )}
                </div>
                <div className={styles.headerTitle}>{title}</div>
                <div className={styles.headerRight}>
                    <button
                        className={styles.settingsBtn}
                        title="Ajustes"
                        onClick={() => setShowSettings(true)}
                    >
                        ⚙️
                    </button>
                </div>
            </header>

            <main className={styles.main} key={String(cents)}>
                <Outlet />
            </main>

            <BottomNav onAddClick={() => handleOpenModal()} />

            {showAddModal && (
                <TransactionModal
                    initialType="expense"
                    accounts={accounts}
                    categories={categories}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleCreate}
                />
            )}

            {showSettings && (
                <SettingsSidebar onClose={() => setShowSettings(false)} />
            )}
        </div>
    );
}

// ── Outer component — provides AppContext to the whole app tree ───────────────
export default function Layout() {
    return (
        <AppProvider>
            <LayoutInner />
        </AppProvider>
    );
}
