import styles from "./SelectButton.module.css";
import { useRef } from "react";

interface SelectButtonProps {
    onFileSelect: (file: File) => void;
}

export function SelectButton({
    onFileSelect,
}: SelectButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
        event.target.value = "";
    };
    
    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
            />
            <button className={styles.select} onClick={handleClick}>
                Seleccionar
            </button>
        </>
    );
}