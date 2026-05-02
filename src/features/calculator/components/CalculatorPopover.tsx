import { useState, useCallback } from "react";
import styles from "../styles/CalculatorPopover.module.css";

interface CalculatorPopoverProps {
    initialNumber: number;
    onConfirm: (value: number) => void;
    onClose: () => void;
}

type Op = "+" | "-" | "×" | "÷" | null;

export function CalculatorPopover({
    initialNumber,
    onConfirm,
    onClose,
}: CalculatorPopoverProps) {
    const [display, setDisplay] = useState(
        initialNumber ? String(initialNumber) : "0",
    );
    const [prev, setPrev] = useState<number | null>(null);
    const [op, setOp] = useState<Op>(null);
    const [waitingOperand, setWaitingOperand] = useState(false);

    const inputDigit = useCallback(
        (digit: string) => {
            if (waitingOperand) {
                setDisplay(digit);
                setWaitingOperand(false);
            } else {
                setDisplay((d) =>
                    d === "0" ? digit : d.length >= 12 ? d : d + digit,
                );
            }
        },
        [waitingOperand],
    );

    const inputDecimal = useCallback(() => {
        if (waitingOperand) {
            setDisplay("0.");
            setWaitingOperand(false);
            return;
        }
        if (!display.includes(".")) setDisplay((d) => d + ".");
    }, [waitingOperand, display]);

    const handleOp = useCallback(
        (nextOp: Op) => {
            const cur = parseFloat(display);
            if (prev !== null && op && !waitingOperand) {
                const result = compute(prev, cur, op);
                setDisplay(String(round2(result)));
                setPrev(round2(result));
            } else {
                setPrev(cur);
            }
            setOp(nextOp);
            setWaitingOperand(true);
        },
        [display, prev, op, waitingOperand],
    );

    const handleEquals = useCallback(() => {
        if (prev === null || !op) return;
        const cur = parseFloat(display);
        const result = round2(compute(prev, cur, op));
        setDisplay(String(result));
        setPrev(null);
        setOp(null);
        setWaitingOperand(true);
    }, [display, prev, op]);

    const handlePercent = useCallback(() => {
        const cur = parseFloat(display);
        const result = round2(prev !== null ? (prev * cur) / 100 : cur / 100);
        setDisplay(String(result));
        setWaitingOperand(true);
    }, [display, prev]);

    const handleClear = useCallback(() => {
        setDisplay("0");
        setPrev(null);
        setOp(null);
        setWaitingOperand(false);
    }, []);

    const handleBackspace = useCallback(() => {
        setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
    }, []);

    const expression = prev !== null && op ? `${round2(prev)} ${op}` : "";

    const BUTTONS = [
        ["C", "⌫", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["0", ".", "="],
    ] as const;

    const handleBtn = (label: string) => {
        if (/\d/.test(label)) {
            inputDigit(label);
            return;
        }
        switch (label) {
            case ".":
                inputDecimal();
                break;
            case "C":
                handleClear();
                break;
            case "⌫":
                handleBackspace();
                break;
            case "%":
                handlePercent();
                break;
            case "+":
            case "-":
            case "×":
            case "÷":
                handleOp(label as Op);
                break;
            case "=":
                handleEquals();
                break;
        }
    };

    return (
        <div className={styles.popover} role="dialog" aria-label="Calculadora">
            <div className={styles.display}>
                <span className={styles.expression}>{expression}</span>
                <span className={styles.value}>{display}</span>
            </div>

            <div className={styles.grid}>
                {BUTTONS.map((row, ri) =>
                    row.map((label) => {
                        const isOp = ["+", "-", "×", "÷"].includes(label);
                        const isEquals = label === "=";
                        const isWide = label === "0";
                        const isClear = label === "C";
                        const isActive = op === label;
                        return (
                            <button
                                key={`${ri}-${label}`}
                                className={[
                                    styles.btn,
                                    isOp ? styles.btnOp : "",
                                    isEquals ? styles.btnEquals : "",
                                    isWide ? styles.btnWide : "",
                                    isClear ? styles.btnClear : "",
                                    isActive ? styles.btnActive : "",
                                ].join(" ")}
                                onClick={() => handleBtn(label)}
                            >
                                {label}
                            </button>
                        );
                    }),
                )}
            </div>

            <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={onClose}>
                    Cancelar
                </button>
                <button
                    className={styles.confirmBtn}
                    onClick={() => {
                        onConfirm(parseFloat(display) || 0);
                        onClose();
                    }}
                >
                    ✓ Usar
                </button>
            </div>
        </div>
    );
}

// ── helpers ─────────────────────────────────────────────────
function compute(a: number, b: number, op: Op): number {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "×":
            return a * b;
        case "÷":
            return b !== 0 ? a / b : 0;
        default:
            return b;
    }
}

function round2(v: number): number {
    return Math.round(v * 100) / 100;
}
