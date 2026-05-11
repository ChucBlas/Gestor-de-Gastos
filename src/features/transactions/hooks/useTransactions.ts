import { useAppContext } from "../../../services/AppContext";
import { transactionsService } from "../services/transactionsService";
import type {
    CreateTransactionInput,
    Transaction,
    UpdateTransactionInput,
} from "../../../services/types";
import { useEffect, useState } from "react";

export function useTransactions() {
    const {
        accounts,
        categories,
        refreshAll,
        bootstrapping: loading,
    } = useAppContext();

    const create = async (data: CreateTransactionInput) => {
        if (!data.amount || !data.account_id) return;
        await transactionsService.create({
            ...data,
            category_id: data.category_id || undefined,
        });
        await refreshAll();
    };

    const update = async (id: number, data: UpdateTransactionInput) => {
        if (!data.amount || !data.account_id) return;
        await transactionsService.update(id, {
            ...data,
            category_id: data.category_id || undefined,
        });
        await refreshAll();
    };

    const remove = async (id: number) => {
        await transactionsService.delete(id);
        await refreshAll();
    };

    const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>(undefined);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    useEffect (() => {
        const fetchFilteredData = async () => {
                const data = await transactionsService.getFromAccountAndCategory(
                    selectedAccountId, 
                    selectedCategoryId
                );
                setFilteredTransactions(data);
        };
        fetchFilteredData();
    }, [selectedAccountId, selectedCategoryId]);

    return {
        transactions: filteredTransactions,
        accounts,
        categories,
        loading: loading,
        create,
        update,
        remove,
        selectedAccountId,
        setSelectedAccountId,
        selectedCategoryId,
        setSelectedCategoryId,
    };
}
