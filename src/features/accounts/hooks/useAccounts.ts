import { useAppContext } from "../../../services/AppContext";
import { accountsService } from "../services/accountsService";
import { useState } from "react";
import type { Account } from "../../../services/types";

export function useAccounts() {
    const { accounts, refreshAll } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const openNewAccountModal = () => {
       setEditingAccount(null);
        setShowModal(true);
    };
    const openEditAccountModal = (account: Account) => {
        setEditingAccount(account);
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleSubmit = async (name: string, balance: number) => {
        if (!name.trim()) return;
        if (editingAccount) {
            await accountsService.edit(editingAccount.id, {
                name,
                new_balance: balance,
            });
        } else {
            await accountsService.create({ name, initial_balance: balance });
        }
        await refreshAll();
        closeModal();
    };

    const handleDelete = async (id: number) => {
        await accountsService.delete(id);
        await refreshAll();
        closeModal();
    };

    return {
        accounts,
        showModal,
        editingAccount,
        openNewAccountModal,
        openEditAccountModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
}
