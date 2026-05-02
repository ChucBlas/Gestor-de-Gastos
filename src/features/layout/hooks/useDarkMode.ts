import { useState } from "react";

const STORAGE_KEY = "darkMode";

function init(): boolean {
    const val = localStorage.getItem(STORAGE_KEY) === "true";
    document.documentElement.setAttribute("data-theme", val ? "dark" : "");
    return val;
}

export function useDarkMode() {
    const [dark, setDark] = useState<boolean>(init);

    const toggleDark = (val: boolean) => {
        setDark(val);
        localStorage.setItem(STORAGE_KEY, String(val));
        document.documentElement.setAttribute("data-theme", val ? "dark" : "");
    };

    return { dark, toggleDark };
}

init();
