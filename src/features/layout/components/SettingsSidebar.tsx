import { SelectButton } from "../../../components/SelectButton/SelectButton";
import { ToggleSwitch } from "../../../components/ToggleSwitch/ToggleSwitch";
import { useAppContext } from "../../../services/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { usePrincipal } from "../hooks/usePrincipal";
import styles from "../styles/SettingsSidebar.module.css";

interface SettingsSidebarProps {
    onClose: () => void;
}

export function SettingsSidebar({ onClose }: SettingsSidebarProps) {
    const { dark, toggleDark } = useDarkMode();
    const {
        cents,
        accounts,
        accountDefaultId,
        setAccountDefaultIdWrapper,
        toggleCents,
    } = useAppContext();
    const { handleSubmit } = usePrincipal();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.sidebar}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <span className={styles.title}>Ajustes</span>
                    <button className={styles.close} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.row}>
                        <div>
                            <div className={styles.rowLabel}>Modo oscuro</div>
                            <div className={styles.rowDesc}>
                                Cambia la tonalidad de la app
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={dark}
                            onChange={toggleDark}
                            id="dark-mode-toggle"
                        />
                    </div>
                    <div className={styles.row}>
                        <div>
                            <div className={styles.rowLabel}>Ver centavos</div>
                            <div className={styles.rowDesc}>
                                Muestra los centavos en los montos
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={cents}
                            onChange={toggleCents}
                            id="view-cents-toggle"
                        />
                    </div>
                    <div className={styles.row}>
                        <div>
                            <div className={styles.rowLabel}>
                                Importar Gastos
                            </div>
                            <div className={styles.rowDesc}>
                                Agrega los gastos desde un CSV, XLS ó XLSX
                            </div>
                        </div>
                        <SelectButton
                            onFileSelect={(path) => {
                                handleSubmit(path, "expense");
                            }}
                        />
                    </div>
                    <div className={styles.row}>
                        <div>
                            <div className={styles.rowLabel}>
                                Importar Ingresos
                            </div>
                            <div className={styles.rowDesc}>
                                Agrega los ingresos desde un CSV, XLS ó XLSX
                            </div>
                        </div>
                        <SelectButton
                            onFileSelect={(path) => {
                                handleSubmit(path, "income");
                            }}
                        />
                    </div>
                    {/* TODO: Implementar botón + la lógica para exportar los datos */}
                    <div style={{ margin: "12px" }}>
                        <select
                            className="form-select account-select"
                            value={accountDefaultId ?? "all"}
                            onChange={(e) =>
                                setAccountDefaultIdWrapper(
                                    e.target.value === "all"
                                        ? null
                                        : parseInt(e.target.value),
                                )
                            }
                        >
                            <option value="all">Orden alfabético</option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
