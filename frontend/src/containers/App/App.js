import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";

import api from "../../services/api";
import LocalStorage from "../../services/localStorage.js";

import Routes from "../Routes";
import { store, persistor } from "../../store";

const localStorageJs = LocalStorage.getService();

function App({ enqueueSnackbar }) {
  const refreshToken = localStorageJs.getRefreshToken();
  const dateToken = localStorageJs.getDateToken();

  useEffect(() => {
    async function refreshToken() {
      if (dateToken) {
        if (300000 + Date.parse(dateToken) > Date.parse(new Date())) {
          api.post("/refresh", { refreshToken }).then((res) => {
            localStorageJs.setToken(res.data);
          });
        }
      }
    }

    refreshToken();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <SnackbarProvider maxSnack={2} preventDuplicate>
            <CssBaseline />
            <Routes />
          </SnackbarProvider>
        </>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
