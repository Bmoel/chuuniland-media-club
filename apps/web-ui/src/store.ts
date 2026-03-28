import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import {authReducer} from "./slices/AuthSlice";

export const store = configureStore({
    devTools: {name: 'media-club'},
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(baseApi.middleware),
});