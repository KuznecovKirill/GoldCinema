import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from "./redux/store";
import { restoreUserState } from './redux/slices/userSlice';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


// const RootComponent = () => {
//   useEffect(() => {
//     const restoreState = async () => {
//       await store.dispatch(restoreUserState());
//     };
//     restoreState();
//   }, []);

//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
// };

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode>
//   <RootComponent />
//   // </React.StrictMode>
// );


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
  <App />
</Provider>
  // </React.StrictMode>
);
