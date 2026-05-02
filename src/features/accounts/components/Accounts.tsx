import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "./AccountCard";
import { AccountModal } from "./AccountModal";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { formatARS } from "../../../services/types";
import styles from "../styles/Accounts.module.css";

export default function Accounts() {
    const {
        accounts,
        showModal,
        editingAccount,
        openNewAccountModal,
        openEditAccountModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useAccounts();

    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Cuentas</h1>
                <button
                    className="btn btn-primary"
                    onClick={openNewAccountModal}
                >
                    ＋ Nueva cuenta
                </button>
            </div>

            {accounts.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon="🏦"
                        message="No tenés cuentas aún. ¡Creá una para empezar!"
                    />
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {accounts.map((acc) => (
                            <AccountCard
                                key={acc.id}
                                account={acc}
                                onEdit={openEditAccountModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                    <div className="card">
                        <div className="card-title">
                            Balance total consolidado
                        </div>
                        <span
                            className={`${styles.totalBalance} ${totalBalance >= 0 ? styles.positive : styles.negative}`}
                        >
                            {formatARS(totalBalance)}
                        </span>
                    </div>
                </>
            )}

            {showModal && (
                <AccountModal
                    account={editingAccount}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
}
