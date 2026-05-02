import { useState } from "react";
import { Modal } from "../../../components/Modal/Modal";
import type { Account } from "../../../services/types";

interface AccountModalProps {
    account: Account | null;
    onClose: () => void;
    onSubmit: (name: string, balance: number) => void;
}

export function AccountModal({
    account,
    onClose,
    onSubmit,
}: AccountModalProps) {
    const isEdit = !!account;
    const [name, setName] = useState(account?.name || "");
    const [balanceStr, setBalanceStr] = useState(
        account ? String(account.balance) : "",
    );

    const handleSubmit = () => {
        const parsedBalance = parseFloat(balanceStr) || 0;
        onSubmit(name, parsedBalance);
    };

    const descLen = name.length;

    const footer = (
        <>
            <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
                {isEdit ? "Guardar cambios" : "Crear cuenta"}
            </button>
        </>
    );

    return (
        <Modal
            title={isEdit ? "Editar cuenta" : "Nueva cuenta"}
            onClose={onClose}
            footer={footer}
        >
            <div className="form-group">
                <label className="form-label">
                    Nombre
                    <span
                        className={`char-counter${descLen > 15 ? " warn" : ""}`}
                    >
                        {descLen}/20
                    </span>
                </label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Ej: Banco"
                    value={name}
                    maxLength={20}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Saldo (ARS)</label>
                <input
                    type="number"
                    className="form-input numeric-input"
                    min="0"
                    placeholder="0"
                    value={balanceStr}
                    onChange={(e) => setBalanceStr(e.target.value)}
                />
            </div>
        </Modal>
    );
}
