import { useEffect, useState } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { CalculatorPopover } from "../../calculator/components/CalculatorPopover";
import {
    type Transaction,
    type Account,
    type Category,
    type CreateTransactionInput,
    type UpdateTransactionInput,
    firstSinCategoria,
} from "../../../services/types";
import styles from "../styles/TransactionModal.module.css";

interface TransactionModalProps {
    initialType: "expense" | "income";
    accounts: Account[];
    categories: Category[];
    onClose: () => void;
    onSubmit?: (data: CreateTransactionInput) => void;
    editing?: Transaction | null;
    onUpdate?: (id: number, data: UpdateTransactionInput) => void;
}

type FormState = {
    amount: number;
    transaction_type: "expense" | "income";
    description: string;
    date: string;
    account_id: number;
    category_id: number;
};

export function TransactionModal({
    initialType,
    accounts,
    categories,
    onClose,
    onSubmit,
    editing,
    onUpdate,
}: TransactionModalProps) {
    const isEdit = !!editing;
    const [showCalc, setShowCalc] = useState(false);
    const [balanceStr, setBalanceStr] = useState(
        editing ? String(editing.amount) : "",
    );

    const accountDefaultId = localStorage.getItem("accountDefaultId");
    const ordenedAccounts = ordAccounts(accounts, accountDefaultId);
    console.log("Ordeñando cuentas, defaultId:", accountDefaultId, "Cuentas ordenadas:", ordenedAccounts);

    const [errorImport, setErrorImport] = useState<(boolean)>(false);
    const [errorDate, setErrorDate] = useState<(boolean)>(false);

    const existingErrors = errorImport || errorDate;

    const [form, setForm] = useState<FormState>({
        amount: 0,
        transaction_type: initialType,
        description: "",
        date: new Date().toISOString().slice(0, 10),
        account_id: ordenedAccounts[0]?.id ?? 0,
        category_id: categories[0]?.id ?? 0,
    });

    const filteredCats = firstSinCategoria(categories, form.transaction_type);
    const defCategory =
        filteredCats.find((c) => c.name === "Sin categoría")?.id || 0;

    useEffect(() => {
        if (isEdit && editing) {
            setForm({
                amount: editing.amount,
                transaction_type: editing.transaction_type as
                    | "expense"
                    | "income",
                description: editing.description ?? "",
                date: editing.date,
                account_id: editing.account_id,
                category_id: editing.category_id,
            });
        } else {
            setForm({
                amount: 0,
                transaction_type: initialType,
                description: "",
                date: new Date().toISOString().slice(0, 10),
                account_id: ordenedAccounts[0]?.id ?? 0,
                category_id: defCategory,
            });
        }
    }, [isEdit, editing, initialType, accounts]);

    const field = <K extends keyof FormState>(k: K, v: FormState[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleTypeChange = (type: "expense" | "income") => {
        const newDefCat =
            categories.find(
                (c) => c.category_type === type && c.name === "Sin categoría",
            )?.id || 0;
        setForm((f) => ({
            ...f,
            transaction_type: type,
            category_id: newDefCat,
        }));
    };

    const descLen = form.description.length;

    const handleSave = () => {
        if (!existingErrors) {
            if (isEdit && editing && onUpdate) {
                onUpdate(editing.id, form);
            } else if (onSubmit) {
                onSubmit(form);
            }
        }
    };

    const handleDate = (date: string) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaIngresada = parseDate(date);
        if (hoy < fechaIngresada) {
            setErrorDate(true);
        } else {
            setErrorDate(false);
        }
        field("date", date);
    }

    const handleImport = (value: string) => {
        setBalanceStr(value);
        const balance = parseFloat(value) || 0;
        if ((balance) <= 0) {
            setErrorImport(true);
        } else {
            setErrorImport(false);
        }
        field("amount", balance);
    }

    const footer = (
        <>
            <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
            </button>
            <button className="btn btn-primary" style={{background: (!existingErrors) ? "" : "#132a20"}} onClick={handleSave}>
                {isEdit ? "Guardar cambios" : "Guardar"}
            </button>
        </>
    );

    return (
        <Modal
            title={isEdit ? "Editar transacción" : "Nueva transacción"}
            onClose={onClose}
            footer={footer}
        >
            <div className={styles.typeToggle}>
                <button
                    className={`${styles.typeBtn} ${styles.expense} ${form.transaction_type === "expense" ? styles.selected : ""}`}
                    onClick={() => handleTypeChange("expense")}
                >
                    ↘ Gasto
                </button>
                <button
                    className={`${styles.typeBtn} ${styles.income} ${form.transaction_type === "income" ? styles.selected : ""}`}
                    onClick={() => handleTypeChange("income")}
                >
                    ↗ Ingreso
                </button>
            </div>

            <div className="form-group">
                <div style={{display: "flex", gap: "10px"}}>
                    <label className="form-label">Importe (ARS)</label>
                    {errorImport && (
                                <p className="alert">Importe inválido!</p>
                            )}
                </div>
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        gap: "8px",
                    }}
                >
                    <input
                        type="number"
                        className="form-input numeric-input"
                        min="0"
                        placeholder="0"
                        value={balanceStr}
                        onChange={(e) => handleImport(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: "0 12px", fontSize: "16px" }}
                        onClick={() => setShowCalc(!showCalc)}
                        title="Calculadora"
                    >
                        🧮
                    </button>
                    {showCalc && (
                        <CalculatorPopover
                            initialNumber={form.amount}
                            onClose={() => setShowCalc(false)}
                            onConfirm={(val) => {handleImport(String(val))}}
                        />
                    )}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Cuenta</label>
                    <select
                        className="form-select"
                        value={form.account_id}
                        onChange={(e) =>
                            field("account_id", parseInt(e.target.value))
                        }
                    >
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <div style={{display: "flex", gap: "10px"}}>
                        <label className="form-label">Fecha</label>
                        {errorDate && (
                            <p className="alert">Fecha inválida!</p>
                        )}
                    </div>
                    <input
                        className="form-input"
                        type="date"
                        value={form.date}
                        onChange={(e) => handleDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                    className="form-select"
                    value={form.category_id}
                    onChange={(e) =>
                        field("category_id", parseInt(e.target.value))
                    }
                >
                    {filteredCats.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">
                    Descripción (opcional)
                    <span
                        className={`char-counter${descLen > 180 ? " warn" : ""}`}
                    >
                        {descLen}/200
                    </span>
                </label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Ej: Supermercado Día"
                    value={form.description}
                    maxLength={200}
                    onChange={(e) => field("description", e.target.value)}
                />
            </div>
        </Modal>
    );
}

function parseDate(date: String): Date {
    const parts = date.split("-").map(e => parseInt(e))
    return new Date(parts[0], parts[1] - 1, parts[2])
}

function ordAccounts(accounts: Account[], defaultId: string | null): Account[] {
    if (defaultId === null) {
        return accounts;
    }

    const accountSelected = accounts.find(a => a.id === parseInt(defaultId));
    if (!accountSelected) {
        return accounts;
    } 
    const accountsWODefId = accounts.filter(a => a.id !== parseInt(defaultId));

    accountsWODefId.unshift(accountSelected)
    return accountsWODefId;
}