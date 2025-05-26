import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bananaReducer from "./slices/bananaSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    banana: bananaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
