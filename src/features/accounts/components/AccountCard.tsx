import { useState } from "react";
import { extendFormatARS } from "../../../services/types";
import type { Account } from "../../../services/types";
import styles from "../styles/AccountCard.module.css";
import { DeleteWindow } from "../../../components/ConfirmWindow/DeleteWindow";

interface AccountCardProps {
    account: Account;
    onEdit: (account: Account) => void;
    onDelete: (id: number) => void;
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className={`card ${styles.card}`}>
            <span className={styles.name}>{account.name}</span>
            <span className={styles.balance}>{extendFormatARS(account.balance)}</span>
            <div className={styles.actions}>
                <button
                    className="btn btn-edit btn-sm"
                    title="Editar"
                    onClick={() => onEdit(account)}
                >
                    ✏️
                </button>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowConfirm(true)}
                >
                    🗑
                </button>
                {showConfirm && (
                    <DeleteWindow
                        title={"¿Eliminar esta cuenta?"}
                        onSubmit={() => {
                            setShowConfirm(false);
                            onDelete(account.id);
                        }}
                        onCancel={() => setShowConfirm(false)}
                        children={"Se eliminarán todas sus transacciones."}
                    />
                )}
            </div>
        </div>
    );
}
