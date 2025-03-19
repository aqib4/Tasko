"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/reducers/user/userSlice";
import todoReducer from "../redux/reducers/todo/todoSlice";
import { todoApi } from "../redux/reducers/todo/todoThunk";
import { authApi } from "../redux/reducers/user/useThunk";


export const store = configureStore({
  reducer: {
    user: userReducer,
    todo: todoReducer,
    [todoApi.reducerPath]: todoApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      todoApi.middleware,
      authApi.middleware,
      ),
});
