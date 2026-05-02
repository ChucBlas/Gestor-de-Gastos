import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./features/layout/components/Layout";
import Dashboard from "./features/dashboard/components/Dashboard";
import Transactions from "./features/transactions/components/Transactions";
import CategoryTransactions from "./features/transactions/components/CategoryTransactions";
import Accounts from "./features/accounts/components/Accounts";
import Categories from "./features/categories/components/Categories";
import Reports from "./features/reports/components/Reports";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "transactions", element: <Transactions /> },
            {
                path: "transactions/category/:id/:name",
                element: <CategoryTransactions />,
            },
            { path: "accounts", element: <Accounts /> },
            { path: "categories", element: <Categories /> },
            { path: "reports", element: <Reports /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
