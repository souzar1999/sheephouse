import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";

import PageLayout from "../PageLayout/PageLayout";
import Routes from "../Routes";
import { store, persistor } from "../../store";

const App = () => (
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

export default App;
