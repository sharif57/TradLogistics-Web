import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./Api/baseApi";
import manualOrderSlice from "./feature/gasCompany/manualOrderSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    manualOrder: manualOrderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
