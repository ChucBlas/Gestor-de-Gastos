import { useAppContext } from "../../../services/AppContext";
import { principalService } from "../services/principalServices";

export function usePrincipal() {
    const { refreshAll, refreshCategories } = useAppContext();

    const handleSubmit = async (
        file: File,
        type_transaction: string,
    ) => {
        try {
            const path = file.name;
            
            const arrayBuffer = await file.arrayBuffer();
            
            const bytes = Array.from(new Uint8Array(arrayBuffer));
            await principalService.processExcel(bytes, path, type_transaction);
            await refreshCategories();
            await refreshAll();
        } catch (error) {
            console.error("Error al cargar transacciones:", error);
        }
    };

    return { handleSubmit };
}
