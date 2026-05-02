import styles from "./EmptyState.module.css";

interface EmptyStateProps {
    icon?: string;
    message: string;
}

export function EmptyState({ icon = "📭", message }: EmptyStateProps) {
    return (
        <div className={styles.root}>
            <span className={styles.icon}>{icon}</span>
            <p className={styles.message}>{message}</p>
        </div>
    );
}
