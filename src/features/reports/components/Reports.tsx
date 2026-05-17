import { useReports, type Period } from "../hooks/useReports";
import { extendFormatARS } from "../../../services/types";
import styles from "../styles/Reports.module.css";
import { CardPieChart } from "./CardPieChart";

const PERIOD_LABELS: Record<Period, string> = {
    day: "Día",
    week: "Semana",
    month: "Mes",
    year: "Año",
    custom: "Personalizado",
};

const MONTH: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

let cont = 0;

function printDate(period: string, multiplier: number) {
    const d = new Date();
    switch (period) {
        case "day":
            d.setDate(d.getDate() + multiplier);
            return `${d.getDate().toString().padStart(2, "0")} de ${MONTH[d.getMonth()]}`;
        case "week":
            const start = new Date();
            start.setDate(start.getDate() - start.getDay() + 7 * multiplier);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const formatDate = (date: Date) =>
                `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
            return `${formatDate(start)} - ${formatDate(end)}`;
        case "month":
            d.setMonth(d.getMonth() + multiplier);
            return `${MONTH[d.getMonth()]} de ${d.getFullYear()}`;
        case "year":
            d.setFullYear(d.getFullYear() + multiplier);
            return `${d.getFullYear()}`;
    }
}

export default function Reports() {
    const {
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
    } = useReports();

    const handlePeriod = (p: String) => {
        const period = (p as Period) || "day";
        setMultiplier(cont);
        setPeriod(period);
    };

    const isBalanceNegative = balance.net < 0;
    const isMobile = window.innerWidth <= 700;

    const incomeChart = {
        balance: balance.total_income,
        categories: incomeCategories,
        title: "Ingresos por Categoría",
    };

    const expenseChart = {
        balance: balance.total_expense,
        categories: expenseCategories,
        title: "Gastos por Categoría",
    };

    const charts =
        isBalanceNegative && isMobile
            ? [expenseChart, incomeChart]
            : [incomeChart, expenseChart];

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Reportes</h1>
                <select
                    className="form-select period-select"
                    value={period}
                    onChange={(e) => {
                        cont = 0;
                        handlePeriod(e.target.value);
                    }}
                >
                    {(
                        ["day", "week", "month", "year", "custom"] as Period[]
                    ).map((p) => (
                        <option key={p} value={p}>
                            {PERIOD_LABELS[p]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="account-filter">
                <select
                    className="form-select account-select"
                    value={selectedAccountId}
                    onChange={(e) =>
                        setSelectedAccountId(
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

            {/* Recuadro que indica que día, mes, año se está visualizando en los reportes */}
            {period !== "custom" && (
                <div className="card">
                    <div className="card-header">
                        <button
                            className={styles.navBtn}
                            onClick={() => {
                                cont--;
                                handlePeriod(period);
                            }}
                        >
                            <div className="icon-arrow icon-left" />
                        </button>
                        <div>{printDate(period, cont)}</div>
                        <button
                            className={styles.navBtn}
                            onClick={() => {
                                cont++;
                                handlePeriod(period);
                            }}
                        >
                            <div className="icon-arrow icon-right" />
                        </button>
                    </div>
                </div>
            )}

            {period === "custom" && (
                <div className="card">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Desde</label>
                            <input
                                className="form-input"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hasta</label>
                            <input
                                className="form-input"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="stat-card">
                <span className="stat-label">Balance neto</span>
                <span
                    className={`stat-value ${balance.net >= 0 ? "income" : "expense"}`}
                >
                    {extendFormatARS(balance.net)}
                </span>
            </div>

            <div className={styles.pieGrid}>
                {charts.map((chart) => (
                    <CardPieChart key={chart.title} {...chart} />
                ))}
            </div>
        </>
    );
}
