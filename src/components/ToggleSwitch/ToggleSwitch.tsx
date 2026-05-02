import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (val: boolean) => void;
    id?: string;
}

export function ToggleSwitch({
    checked,
    onChange,
    id = "toggle",
}: ToggleSwitchProps) {
    return (
        <label className={styles.switch} htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.track} />
        </label>
    );
}
