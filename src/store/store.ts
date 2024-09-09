import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ClinicReducer from "./reducer/ClinicReducer";
import DashboardReducer from "./reducer/DashboardReducer";
import PatientReducer from "./reducer/PatientReducer";
import QuestionairesReducer from "./reducer/QuestionairesReducer";

const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
    questionairesReduer: QuestionairesReducer,
    PatientService: PatientReducer,
    DashboardFilters: DashboardReducer,
    clinicReducer: ClinicReducer,
  });

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({ reducer: persistedReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); 
export default store;