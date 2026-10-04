import { type PaletteMode } from "@mui/material";

export const getPalette = (mode: PaletteMode) => ({
  mode,

  ...(mode === "light"
    ? {
      // primary: {
      //   main: "#1E3B2B",
      //   light: "#43644F",
      //   dark: "#61c9b4ff",
      //   contrastText: "#FFFFFF",
      // },

      // secondary: {
      //   main: "#D48C6F",
      //   light: "#E3AF9A",
      //   dark: "#A85F44",
      // },

      // success: {
      //   main: "#4CAF50",
      //   light: "#E8F5E9",
      //   contrastText: "#FFFFFF",
      // },

      // background: {
      //   default: "#e3f6f6ff",
      //   paper: "#ffffffff",
      // },

      // text: {
      //   primary: "#1A241F",
      //   secondary: "#5C6460",
      // },
      primary: {
        main: "#215c5aff",
        light: "#45928cff",
        dark: "#153d3bff",
        contrastText: "#e6ffffff",
      },

      secondary: {
        main: "#8CD9FF",
        light: "#CDEFFF",
        dark: "#5FBEE6",
      },

      success: {
        main: "#4CAF50",
        light: "#81C784",
      },

      background: {
        default: "#EAF9F8",
        paper: "#f2f2f1ff",
        
      },

      text: {
        primary: "#163C3B",
        secondary: "#5E7474",
      },
    }
    : {
      // primary: {
      //   main: "#76deafff",
      //   light: "#A5E89E",
      //   dark: "#5AA84F",
      //   contrastText: "#121212",
      // },

      // secondary: {
      //   main: "#E3AF9A",
      //   light: "#F0C9BA",
      //   dark: "#C47D60",
      // },

      // success: {
      //   main: "#00ddffff",
      //   light: "#11193dff",
      //   contrastText: "#FFFFFF",
      // },

      // background: {
      //   default: "#00010dff",
      //   paper: "#1e1e1eff",
      // },

      // text: {
      //   primary: "#b4fbfbff",
      //   secondary: "#c2d5d6ff",
      // },
      primary: {
        main: "#4DD0E1",
        light: "#80DEEA",
        dark: "#0097A7",
        contrastText: "#02001aff",
      },

      secondary: {
        main: "#60A5FA",
        light: "#93C5FD",
        dark: "#1c2d51ff",
      },

      success: {
        main: "#4ADE80",
        light: "#86EFAC",
      },

      background: {
        default: "#01011dff",
        paper: "#0b1344ff",
      },

      text: {
        primary: "#EAFBFF",
        secondary: "#A7C7D8",
      },
    }),
});