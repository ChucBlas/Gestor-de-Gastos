import { PieChart, Pie, Cell } from "recharts";
import { CategorySummary, formatARS } from "../../../services/types";
import styles from "../styles/Reports.module.css";
import { CategoryReport } from "./CategoryReport";

interface FinanceDonutChart {
    categories: CategorySummary[];
    totalValue: number;
}

export function FinanceDonutChart({
    categories,
    totalValue,
}: FinanceDonutChart) {
    return (
        <div>
            <div className={styles.pieContent}>
                <PieChart
                    style={{
                        width: "100%",
                        maxWidth: "300px",
                        maxHeight: "300px",
                        aspectRatio: 1,
                    }}
                >
                    <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={115}
                        stroke="var(--bg-card)"
                        strokeWidth={2}
                        dataKey="total"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        animationDuration={600}
                    >
                        {categories.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color ?? "#888"}
                            />
                        ))}
                    </Pie>
                </PieChart>

                <div className={styles.pieInfo}>
                    <span className={styles.infoTitle}>Total</span>
                    <span className={styles.number}>
                        {formatARS(totalValue)}
                    </span>
                </div>
            </div>
            <div>
                {categories.map((cat) => (
                    <CategoryReport
                        category={cat}
                        percentOfTotal={cat.total / totalValue}
                    />
                ))}
            </div>
        </div>
    );
}
