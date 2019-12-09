import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import appReducer from "./reducers";
import appSaga from "./sagas";

const persistConfig = {
  key: "sheephouse",
  storage
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(appSaga);

let persistor = persistStore(store);

export { store, persistor };
