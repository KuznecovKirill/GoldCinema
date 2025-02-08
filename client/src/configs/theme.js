import { createTheme } from '@mui/material/styles';
import { colors } from "@mui/material";

export const themeModes = {
    dark: "dark",
    light: "light"
};

const themeConfigs = {
    custom: ({ mode }) => { //функция для определения темы приложения
      const customPalette = mode === themeModes.dark ? { //если тёмная
        primary: {
          main: "#ff0000",
          contrastText: "#ffffff"
        },
        secondary: {
          main: "#f44336",
          contrastText: "#ffffff"
        },
        background: {
          default: "#000000",
          paper: "#131313"
        }
      } : { //иначе светлая
        primary: {
          main: "#ff0000"
        },
        secondary: {
          main: "#f44336"
        },
        background: {
          default: colors.grey["100"],
        }
      };
  
      // Возвращение объекта конфигурации
      return createTheme({
        palette: {
          mode,
          ...customPalette
        },
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true }
          }
        }
      });
    }
  };
  export default themeConfigs;