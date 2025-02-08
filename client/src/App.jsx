import themeConfigs from "./configs/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./routes/routes";
import { useSelector } from "react-redux";

import PageWrapper from "./components/common/PageWrapper";
import Layout from "./components/layout/Layout";
const App = () => {
  const { themeMode } = useSelector((state) => {
    return state.themeMode;});

  return (
    <ThemeProvider theme={themeConfigs.custom({mode: themeMode})}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme={themeMode} 
        />
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          {routes.map((route, index) => (
            route.index ? (
              <Route
                index
                key={index}
                element={route.state ? (
                  <PageWrapper state={route.state}>{route.element}</PageWrapper>
                ) : route.element}
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={route.state ? (
                    <PageWrapper state={route.state}>{route.element}</PageWrapper>
                  ) : route.element}
                  />
                )
              ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
