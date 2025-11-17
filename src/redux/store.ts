import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./Api/baseApi";
import { chatApi } from "./feature/chatSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(chatApi.middleware),
});

export default store;
