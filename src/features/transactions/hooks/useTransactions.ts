import { useAppContext } from "../../../services/AppContext";
import { transactionsService } from "../services/transactionsService";
import type {
    CreateTransactionInput,
    Transaction,
    UpdateTransactionInput,
} from "../../../services/types";
import { useCallback, useEffect, useState } from "react";

export function useTransactions() {
    const { accounts, categories, transactions, refreshAll, bootstrapping } =
        useAppContext();

    const [selectedAccountId, setSelectedAccountId] = useState<
        number | undefined
    >(undefined);
    const [selectedCategoryId, setSelectedCategoryId] = useState<
        number | undefined
    >(undefined);

    const [filteredTransactions, setFilteredTransactions] =
        useState<Transaction[]>(transactions);

    const fetchFilteredData = useCallback(async () => {
        try {
            const data = await transactionsService.getFromAccountAndCategory(
                selectedAccountId,
                selectedCategoryId,
            );
            setFilteredTransactions(data);
        } catch (error) {
            console.error("Error cargando transacciones filtradas:", error);
        }
    }, [selectedAccountId, selectedCategoryId]);

    useEffect(() => {
        if (bootstrapping) return;
        fetchFilteredData();
    }, [bootstrapping, fetchFilteredData, transactions]);

    const create = async (data: CreateTransactionInput) => {
        if (!data.amount || !data.account_id) return;
        await transactionsService.create({
            ...data,
            category_id: data.category_id || undefined,
        });
        await refreshAll();
        await fetchFilteredData();
    };

    const update = async (id: number, data: UpdateTransactionInput) => {
        if (!data.amount || !data.account_id) return;
        await transactionsService.update(id, {
            ...data,
            category_id: data.category_id || undefined,
        });
        await refreshAll();
        await fetchFilteredData();
    };

    const remove = async (id: number) => {
        await transactionsService.delete(id);
        await refreshAll();
        await fetchFilteredData();
    };

    return {
        transactions: filteredTransactions,
        accounts,
        categories,
        loading: bootstrapping,
        create,
        update,
        remove,
        selectedAccountId,
        setSelectedAccountId,
        selectedCategoryId,
        setSelectedCategoryId,
    };
}
