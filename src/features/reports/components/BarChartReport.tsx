import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { formatARS, MonthlyData } from "../../../services/types";

export function BarChartReport(monthlyData: MonthlyData[], year: number) {
    function extraBar(month: MonthlyData): number {
        return month.income - month.expense;
    }

    return (
        <div className="card">
            <div className="card-title">Ingresos vs Gastos — {year}</div>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                    />
                    <XAxis
                        dataKey="month"
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        formatter={(v: unknown) => formatARS(v as number)}
                        contentStyle={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                        }}
                        labelStyle={{ color: "var(--text)" }}
                    />
                    <Legend />
                    <Bar
                        dataKey="income"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey={extraBar}
                        name="Balance"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
