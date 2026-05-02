import styles from "./Badge.module.css";

interface BadgeProps {
    label: string;
    variant: "expense" | "income";
    clickable?: boolean;
    onClick?: () => void;
}

export function Badge({ label, variant, clickable, onClick }: BadgeProps) {
    return (
        <span
            className={`${styles.badge} ${styles[variant]} ${clickable ? styles.clickable : ""}`}
            onClick={onClick}
            title={clickable ? `Ver transacciones de "${label}"` : undefined}
        >
            {label}
        </span>
    );
}
