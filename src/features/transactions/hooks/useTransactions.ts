import { useAppContext } from "../../../services/AppContext";
import { transactionsService } from "../services/transactionsService";
import type {
    CreateTransactionInput,
    UpdateTransactionInput,
} from "../../../services/types";

export function useTransactions() {
    const {
        transactions,
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

    return {
        transactions,
        accounts,
        categories,
        loading,
        create,
        update,
        remove,
    };
}
