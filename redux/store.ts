import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import portfolioReducer from "./slices/portfolioSlice";
import dollarReducer from "./slices/dollarSlice";
import benchmarkReducer from "./slices/benchmarkSlice";

const rootReduce = combineReducers({
  // Aquí añades tus reducers normales
  portfolio: portfolioReducer,
  dollar: dollarReducer,
  benchmark: benchmarkReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReduce);

export type AppState = ReturnType<typeof rootReduce>;

export const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);
