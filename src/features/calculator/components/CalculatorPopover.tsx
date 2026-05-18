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

    const [tokens, setTokens] = useState<(number | string)[]>([]);
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

    const handleOperator = useCallback(
        (nextOp: Op) => {
            const currentValue = parseFloat(display);

            // Reemplazamos un operador si antes habíamos tocado otro
            if (waitingOperand && tokens.length > 0) {
                setTokens((prev) => {
                    const newTokens = [...prev];
                    newTokens[newTokens.length - 1] = nextOp!;
                    return newTokens;
                });
                return;
            }

            const newTokens = [...tokens, currentValue, nextOp!];
            setTokens(newTokens);

            const runningResult = evaluateTokens(newTokens.slice(0, -1));
            setDisplay(String(round2(runningResult)));

            setWaitingOperand(true);
        },
        [display, tokens, waitingOperand],
    );

    const handleEquals = useCallback(() => {
        if (tokens.length === 0) return;

        let finalTokens = [...tokens];

        if (waitingOperand) {
            finalTokens = finalTokens.slice(0, -1);
        } else {
            finalTokens.push(parseFloat(display));
        }

        const result = round2(evaluateTokens(finalTokens));
        setDisplay(String(result));
        setTokens([]);
        setWaitingOperand(true);
    }, [display, tokens, waitingOperand]);

    const handlePercent = useCallback(() => {
        const cur = parseFloat(display);
        if (tokens.length > 0) {
            const base = evaluateTokens(tokens.slice(0, -1));
            const result = round2((base * cur) / 100);
            setDisplay(String(result));
        } else {
            setDisplay(String(round2(cur / 100)));
        }
        setWaitingOperand(true);
    }, [display, tokens]);

    const handleClear = useCallback(() => {
        setDisplay("0");
        setTokens([]);
        setWaitingOperand(false);
    }, []);

    const handleBackspace = useCallback(() => {
        setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
    }, []);

    const expression = tokens.join(" ");

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
                handleOperator(label as Op);
                break;
            case "=":
                handleEquals();
                break;
        }
    };

    const activeOp =
        tokens.length > 0 && waitingOperand ? tokens[tokens.length - 1] : null;

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
                        const isActive = activeOp === label;
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

function evaluateTokens(tokens: (number | string)[]): number {
    if (tokens.length === 0) return 0;

    const tempTokens = [...tokens];

    // 1ra Pasada: Resolver Multiplicaciones y Divisiones primero
    for (let i = 0; i < tempTokens.length; i++) {
        const token = tempTokens[i];
        if (token === "×" || token === "÷") {
            const a = tempTokens[i - 1] as number;
            const b = tempTokens[i + 1] as number;
            const result = token === "×" ? a * b : b !== 0 ? a / b : 0;

            tempTokens.splice(i - 1, 3, result);
            i -= 2;
        }
    }

    // 2da Pasada: Resolver Sumas y Restas
    let result = tempTokens[0] as number;
    for (let i = 1; i < tempTokens.length; i += 2) {
        const op = tempTokens[i];
        const next = tempTokens[i + 1] as number;
        if (op === "+") result += next;
        if (op === "-") result -= next;
    }

    return result;
}

function round2(v: number): number {
    return Math.round(v * 100) / 100;
}
