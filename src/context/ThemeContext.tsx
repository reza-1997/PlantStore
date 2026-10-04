import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { CssBaseline, ThemeProvider, type Direction } from "@mui/material";
import { getTheme } from "../theme/them";
import { useTranslation } from "react-i18next";


type Mode = "light" | "dark";

interface ThemeContextType {
    mode: Mode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProviderContext = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<Mode>(() => {
        return (localStorage.getItem("theme") as Mode) || "light";
    });

    const { i18n } = useTranslation();

    const currentLang = i18n.language || "fa";
    const direction: Direction = currentLang.startsWith("en") ? "ltr" : "rtl";

    const theme = useMemo(
        () => getTheme(mode, direction),
        [mode, direction]
    );

    const toggleTheme = () => {
        setMode((prev) => {
            const newMode = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", newMode);
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useColorMode = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useColorMode must be used inside ThemeProviderContext");
    }

    return context;
};