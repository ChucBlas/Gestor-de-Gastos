export interface Account {
    id: number;
    name: string;
    balance: number;
    currency: string;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    category_type: string;
    icon: string | null;
    color: string | null;
}

export interface Transaction {
    id: number;
    amount: number;
    transaction_type: string;
    description: string | null;
    date: string;
    account_id: number;
    account_name: string | null;
    category_id: number;
    category_name: string | null;
    created_at: string;
}

export interface PeriodBalance {
    total_income: number;
    total_expense: number;
    net: number;
}

export interface CategorySummary {
    category_name: string;
    category_type: string;
    color: string | null;
    total: number;
}

export interface MonthlyData {
    month: string;
    income: number;
    expense: number;
}

export interface DashboardSummary {
    total_balance: number;
    month_income: number;
    month_expense: number;
    recent_transactions: Transaction[];
}

export interface CreateAccountInput {
    name: string;
    initial_balance: number;
}

export interface UpdateAccountInput {
    name: string;
    new_balance: number;
}

export interface CreateCategoryInput {
    name: string;
    category_type: string;
    icon?: string;
    color?: string;
}

export interface UpdateCategoryInput {
    name?: string;
    category_type: string;
    icon?: string;
    color?: string;
}

export interface CreateTransactionInput {
    amount: number;
    transaction_type: "expense" | "income";
    description?: string;
    date: string;
    account_id: number;
    category_id?: number;
}

export interface UpdateTransactionInput {
    amount: number;
    transaction_type: "expense" | "income";
    description?: string;
    date: string;
    account_id: number;
    category_id?: number;
}

export function formatARS(amount: number): string {
    if (amount >= 1000000 || amount <= -1000000) {
        return new Intl.NumberFormat("es-AR", {
            notation: "compact",
            compactDisplay: "short",
        }).format(amount);
    }

    const viewCentsString = localStorage.getItem("viewCents") || "true";
    const cantCents = viewCentsString === "true" ? 2 : 0;

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: cantCents,
        maximumFractionDigits: cantCents,
        roundingMode: "trunc",
    } as any).format(amount);
}

export function extendFormatARS(amount: number): string {
    const viewCentsString = localStorage.getItem("viewCents") || "true";
    const cantCents = viewCentsString === "true" ? 2 : 0;

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: cantCents,
        maximumFractionDigits: cantCents,
        roundingMode: "trunc",
    } as any).format(amount);
}

export function formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

export function firstSinCategoria(
    categories: Category[],
    type: "expense" | "income",
): Category[] {
    return categories
        .filter((c) => c.category_type === type)
        .sort((a, b) => {
            if (a.name === "Sin categoría") return -1;
            if (b.name === "Sin categoría") return 1;
            return a.name.localeCompare(b.name);
        });
}
