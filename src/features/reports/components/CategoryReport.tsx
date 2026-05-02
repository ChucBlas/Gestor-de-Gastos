import { CategorySummary } from "../../../services/types";
import styles from "../styles/CategoryReport.module.css";

interface CategoryReport {
    category: CategorySummary;
    percentOfTotal: number;
}

export function CategoryReport({ category, percentOfTotal }: CategoryReport) {
    const formatPercent = (value: number) => {
        const newValue = value * 100;
        return newValue.toFixed(2);
    };
    return (
        <div className={styles.reportCategoryChip}>
            <span
                className={styles.colorCategory}
                style={{ background: category.color ?? "var(--text-dim)" }}
            />
            <span className={styles.infoCategory}>
                {category.category_name}
            </span>
            <div className={styles.percentInfo}>
                <span className={styles.infoCategory}>
                    {formatPercent(percentOfTotal)} %
                </span>
            </div>
        </div>
    );
}
