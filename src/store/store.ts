import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice/counterSlice";
import authReducer from "./Slices/AuthSlice/authSlice";
import formReducer from "./Slices/FormSlice/FormSlice";
import baseApi from "./Api/BaseApi/BaseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    counter: counterReducer,
    auth: authReducer,
    form: formReducer,
  },
  middleware: (get) => get().concat(baseApi.middleware),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
