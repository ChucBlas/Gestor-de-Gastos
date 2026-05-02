import { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
    title?: string;
    onClose: () => void;
    children?: ReactNode;
    footer?: ReactNode;
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
    return (
        <div
            className={styles.backdrop}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div>
                        {title && <span className={styles.title}>{title}</span>}
                    </div>
                    <div>
                        <button className={styles.close} onClick={onClose}>
                            ×
                        </button>
                    </div>
                </div>
                <div className={styles.body}>{children}</div>
                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
}
