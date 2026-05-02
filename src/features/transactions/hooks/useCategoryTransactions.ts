import { useEffect, useState } from "react";
import { transactionsService } from "../services/transactionsService";
import { useAppContext } from "../../../services/AppContext";
import type {
    Transaction,
    UpdateTransactionInput,
} from "../../../services/types";

export function useCategoryTransactions(categoryId: number | null) {
    const { accounts, categories, refreshAll } = useAppContext();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const all = await transactionsService.getAll(500);
        setTransactions(
            categoryId != null
                ? all.filter((t) => t.category_id === categoryId)
                : all,
        );
        setLoading(false);
    };

    useEffect(() => {
        load();
        window.addEventListener("transaction-saved", load);
        return () => window.removeEventListener("transaction-saved", load);
    }, [categoryId]);

    const update = async (id: number, data: UpdateTransactionInput) => {
        if (!data.amount || !data.account_id) return;
        await transactionsService.update(id, {
            ...data,
            category_id: data.category_id || undefined,
        });
        await refreshAll();
        load();
    };

    const remove = async (id: number) => {
        await transactionsService.delete(id);
        await refreshAll();
        load();
    };

    return { transactions, accounts, categories, loading, update, remove };
}
