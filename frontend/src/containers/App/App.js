import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";

import api from "../../services/api";
import localStorage from "../../services/localStorage.js";

import PageLayout from "../PageLayout/PageLayout";
import Routes from "../Routes";
import { store, persistor } from "../../store";

function App({ enqueueSnackbar }) {
  const refreshToken = localStorage.getRefreshToken();
  const dateToken = localStorage.getDateToken();

  useEffect(() => {
    async function refreshToken() {
      if (dateToken) {
        if (43200000 + Date.parse(dateToken) > Date.parse(new Date())) {
          api.post("/refresh", { refreshToken }).then(res => {
            localStorage.setToken(res.data);
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
            <PageLayout>
              <Routes />
            </PageLayout>
          </SnackbarProvider>
        </>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
