import { useRoutes } from "raviger";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import NotFound from "./components/common/NotFound";
import { authAtom } from "./recoil/state/auth";
import AppRouter from "./router/AppRouter";
import PublicRouter from "./router/PublicRouter";
import { Provider } from 'react-redux';
import { store } from "./store";

function App() {
  const [auth] = useRecoilState(authAtom);

  const routes = {
    "/": () => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/profile": () => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/coverage": () => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/coverage/:id": ({ id }: any) => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/claims": () => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/claims/:id": ({ id }: any) => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/preauths": () => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "/preauths/:id": ({ id }: any) => auth.isAuthenticated === "true" ? <AppRouter /> : <PublicRouter />,
    "*": () => <NotFound />
  };

  const route = useRoutes(routes);

  return (
    <Provider store={store}>
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {route}
    </div>
    </Provider>
  );
}

export default App;
