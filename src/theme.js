import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
    100: "#F7F7F7",
    200: "#E1E1E1",
    300: "#CFCFCF",
    400: "#B1B1B1",
    500: "#9E9E9E",
    600: "#7E7E7E",
    700: "#626262",
    800: "#3B3B3B",
    900: "#222222",
  },
  primary: {
    100: "#E3F2FD",
    200: "#BBDEFB",
    300: "#90CAF9",
    400: "#64B5F6",
    500: "#42A5F5",
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
  },
  greenAccent: {
    100: "#E8F5E9",
    200: "#C8E6C9",
    300: "#A5D6A7",
    400: "#81C784",
    500: "#66BB6A",
    600: "#43A047",
    700: "#388E3C",
    800: "#2E7D32",
    900: "#1B5E20",
  },
  redAccent: {
    100: "#FFEBEE",
    200: "#FFCDD2",
    300: "#EF9A9A",
    400: "#E57373",
    500: "#EF5350",
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
  },
  blueAccent: {
    100: "#E3F2FD",
    200: "#BBDEFB",
    300: "#90CAF9",
    400: "#64B5F6",
    500: "#42A5F5",
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
  },
}
:
{
  grey: {
    100: "#222222",
    200: "#3B3B3B",
    300: "#626262",
    400: "#7E7E7E",
    500: "#9E9E9E",
    600: "#B1B1B1",
    700: "#CFCFCF",
    800: "#E1E1E1",
    900: "#F7F7F7",
  },
  primary: {
    100: "#0D47A1",
    200: "#1565C0",
    300: "#1976D2",
    400: "#1E88E5",
    500: "#42A5F5",
    600: "#64B5F6",
    700: "#90CAF9",
    800: "#BBDEFB",
    900: "#E3F2FD",
  },
  greenAccent: {
    100: "#1B5E20",
    200: "#2E7D32",
    300: "#388E3C",
    400: "#43A047",
    500: "#66BB6A",
    600: "#81C784",
    700: "#A5D6A7",
    800: "#C8E6C9",
    900: "#E8F5E9",
  },
  redAccent: {
    100: "#B71C1C",
    200: "#C62828",
    300: "#D32F2F",
    400: "#E53935",
    500: "#EF5350",
    600: "#E57373",
    700: "#EF9A9A",
    800: "#FFCDD2",
    900: "#FFEBEE",
  },
  blueAccent: {
    100: "#0D47A1",
    200: "#1565C0",
    300: "#1976D2",
    400: "#1E88E5",
    500: "#42A5F5",
    600: "#64B5F6",
    700: "#90CAF9",
    800: "#BBDEFB",
    900: "#E3F2FD",
  },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
