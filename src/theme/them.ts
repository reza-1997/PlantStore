import { createTheme, type Direction, type PaletteMode } from "@mui/material";
import { getPalette } from "./palette";

export const getTheme = (mode: PaletteMode, direction: Direction = 'rtl') =>
    createTheme({
        palette: getPalette(mode),
        direction,
        shape: {
            borderRadius: 8,
        },

        typography: {
            fontFamily: direction === 'rtl' ? "Vazirmatn, sans-serif" : "Roboto, sans-serif",
            h1: {
                fontWeight: 700,
                color: "#1E3B2B",
            },
            h2: {
                fontWeight: 600,
                color: "#1E3B2B",
            },
            h3: {
                fontWeight: 600,
                color: "#1E3B2B",
            },
            button: {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 4,
            },
        },
    });

