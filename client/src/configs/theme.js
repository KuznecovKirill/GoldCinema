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
          main: "#FFD700", //золотой
          contrastText: "#000000" //чёрный
        },
        secondary: {
          main: "#FFD736",
          contrastText: "#ffffff"
        },
        background: {
          default: "#000000",
          paper: "#131313"
        }
      } : { //иначе светлая
        primary: {
          main: "#FFD700"
        },
        secondary: {
          main: "#FFD736"
        },
        background: {
          default: colors.grey["100"],
        }
      };
  //#f44336 -красный
  //#ff0000 - самый красный
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