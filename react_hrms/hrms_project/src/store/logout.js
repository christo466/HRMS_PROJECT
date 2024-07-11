// src/store/auth.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logoutApi } from '../api/logout';

// Action Types
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

// Async Thunk for Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await logoutApi();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial State
const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Reducer
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
