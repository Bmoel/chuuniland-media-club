import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    jwtToken: string | undefined;
    avatarUrl: string | undefined;
    name: string | undefined;
}

const initialState: AuthState = {
    jwtToken: undefined,
    avatarUrl: undefined,
    name: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ jwtToken: string; avatarUrl?: string; name?: string }>) {
            state.jwtToken = action.payload.jwtToken;
            state.avatarUrl = action.payload.avatarUrl;
            state.name = action.payload.name;
        },
    }
});

export const { setAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

type AuthRootState = { auth: AuthState };

const selectAuthState = (state: AuthRootState) => state.auth;

export const selectJwtToken = (state: AuthRootState) => selectAuthState(state).jwtToken;
export const selectAvatarUrl = (state: AuthRootState) => selectAuthState(state).avatarUrl;
export const selectName = (state: AuthRootState) => selectAuthState(state).name;
export const selectIsAuthenticated = (state: AuthRootState) => !!selectJwtToken(state);