import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/BottomNav.module.css";

interface BottomNavProps {
    onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
    const location = useLocation();
    const navigate = useNavigate();


    const isInitialPage = location.key === 'default';


    const handleNavigation = (path: string) => {
        if (isInitialPage) {
            navigate(path); 
        } else {
            navigate(path, { replace: true });
        }
    };
    return (
        <nav className={styles.nav}>
            <NavLink
                to="/reports"
                onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/reports");
                }}
                className={({ isActive }) =>
                    `${styles.tab}${isActive ? ` ${styles.active}` : ""}`
                }
            >
                <span className={styles.icon}>📊</span>
                <span className={styles.label}>Reportes</span>
            </NavLink>

            <NavLink
                to="/transactions"
                onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/transactions");
                }}
                className={({ isActive }) =>
                    `${styles.tab}${isActive ? ` ${styles.active}` : ""}`
                }
            >
                <span className={styles.icon}>📋</span>
                <span className={styles.label}>Transacciones</span>
            </NavLink>

            <div className={styles.center}>
                <button
                    className={styles.addBtn}
                    title="Nueva transacción"
                    onClick={onAddClick}
                >
                    <span>+</span>
                </button>
            </div>

            <NavLink
                to="/categories"
                onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/categories");
                }}
                className={({ isActive }) =>
                    `${styles.tab}${isActive ? ` ${styles.active}` : ""}`
                }
            >
                <span className={styles.icon}>🏷️</span>
                <span className={styles.label}>Categorías</span>
            </NavLink>

            <NavLink
                to="/accounts"
                onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/accounts");
                }}
                className={({ isActive }) =>
                    `${styles.tab}${isActive ? ` ${styles.active}` : ""}`
                }
            >
                <span className={styles.icon}>🏦</span>
                <span className={styles.label}>Cuentas</span>
            </NavLink>
        </nav>
    );
}
