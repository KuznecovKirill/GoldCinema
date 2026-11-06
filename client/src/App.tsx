import React from "react";
import themeConfigs from "./configs/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./routes/routes";
import { useAppSelector } from "./redux/hooks";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PageWrapper from "./components/common/PageWrapper";
import Layout from "./components/layout/Layout";

// Описываем структуру маршрута (так как routes.jsx пока на JS)
interface AppRoute {
  index?: boolean;
  path?: string;
  state?: string;
  element: React.ReactNode;
}

const App: React.FC = () => {
  // Временное решение, если store еще не типизирован: (state: any)
  // В идеале здесь должен быть RootState из вашего store
  const { themeMode } = useAppSelector((state: any) => state.themeMode);

  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
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
          <Route path="/" element={<Layout />}>
            {/* Приводим массив routes к нашему интерфейсу AppRoute[] */}
            {(routes as AppRoute[]).map((route, index) =>
              route.index ? (
                <Route
                  index
                  key={index}
                  element={
                    route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              )
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;