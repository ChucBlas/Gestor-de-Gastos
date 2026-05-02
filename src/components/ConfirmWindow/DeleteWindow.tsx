import { Modal } from "../Modal/Modal";
import "./DeleteWindow.css";

interface DeleteWindowProps {
    title?: string;
    onSubmit: () => void;
    onCancel: () => void;
    children?: string;
}

export function DeleteWindow({
    title,
    onSubmit,
    onCancel,
    children,
}: DeleteWindowProps) {
    const footer = (
        <>
            <button className="btn btn-ghost" onClick={onCancel}>
                Cancelar
            </button>
            <button className="btn btn-primary" onClick={onSubmit}>
                Confirmar
            </button>
        </>
    );

    return (
        <Modal title={title} onClose={onCancel} footer={footer}>
            <h1 className="principal-text">{children}</h1>
        </Modal>
    );
}
