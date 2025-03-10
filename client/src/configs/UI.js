const uiConfigs = {
    style: { //настройка стилей
      gradientBgImage: { //градиентные фоновые изображения
        dark: {
          backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
        },
        light: {
          backgroundImage: "linear-gradient(to top, rgba(245,245,245,1), rgba(0,0,0,0))"
        }
      },
      horizontalGradientBgImage: {
        dark: {
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))"
        },
        light: {
          backgroundImage: "linear-gradient(to right, rgba(245,245,245,1), rgba(0,0,0,0))"
        }
      },
      typoLines: (lines, textAlign) => ({ //для обрезки многострочного текста
        textAlign: textAlign || "justify",
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines
      }),
      mainContent: { //стиль основной страницы
        maxWidth: "1400px",
        margin: "auto",
        padding: 2
      },
      backgroundImage: (imgPath) => ({ //стиль для фоновго изображения
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "darkgrey",
        backgroundImage: `url(${imgPath})`
      })
    },
    size: { //размер
      sidebarWith: "300px",
      contentMaxWidth: "1400px"
    }
  };
  
  export default uiConfigs;