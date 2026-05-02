import { DeleteWindow } from "../../../components/ConfirmWindow/DeleteWindow";
import { Modal } from "../../../components/Modal/Modal";
import { extendFormatARS, Transaction } from "../../../services/types";
import styles from "../styles/TransactionInfoModal.module.css";

interface TransactionInfoModalProps {
    tx: Transaction;
    showConfirm: boolean;
    onClose: () => void;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: number) => void;
    setShowConfirm: (action: boolean) => void;
}

export function TransactionInfoModal({
    tx,
    showConfirm,
    onClose,
    onEdit,
    onDelete,
    setShowConfirm,
}: TransactionInfoModalProps) {
    const footer = (
        <>
            <button
                className="btn btn-edit btn-sm"
                title="Editar"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(tx);
                }}
            >
                ✏️
            </button>
            <button
                className="btn btn-danger btn-sm"
                title="Eliminar"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
            >
                🗑
            </button>
            {showConfirm && (
                <DeleteWindow
                    onSubmit={() => {
                        setShowConfirm(false);
                        onDelete(tx.id);
                    }}
                    onCancel={() => setShowConfirm(false)}
                    children={"¿Eliminar este transacción?"}
                />
            )}
        </>
    );

    return (
        <Modal title="Información detallada" onClose={onClose} footer={footer}>
            <div className={styles.label}>
                <div className={styles.title}>Descripción:</div>
                <div className={styles.info}>
                    {tx.description || "Sin descripción"}
                </div>
            </div>
            <div className={styles.label}>
                <div className={styles.title}>Cuenta:</div>
                <div className={styles.info}>{tx.account_name}</div>
            </div>
            <div className={styles.label}>
                <div className={styles.title}>Categoría:</div>
                <div
                    className={`${styles.info} ${tx.transaction_type === "income" ? styles.income : styles.expense}`}
                >
                    {tx.category_name || "Sin categoría"}
                </div>
            </div>
            <div className={styles.label}>
                <div className={styles.title}>Importe:</div>
                <div
                    className={`${styles.info} ${tx.transaction_type === "income" ? styles.income : styles.expense}`}
                >
                    {extendFormatARS(tx.amount)}
                </div>
            </div>
        </Modal>
    );
}
