import { configureStore, createSlice } from '@reduxjs/toolkit';
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null)
            return undefined;
        return JSON.parse(serializedState);
    }
    catch (e) {
        console.error('Could not load state from localStorage:', e);
        return undefined;
    }
};
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('authState', serializedState);
    }
    catch (e) {
        console.error('Could not save state to localStorage:', e);
    }
};
const initialState = loadState() || {
    isAuthenticated: false,
    user: null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});
export const { loginSuccess, logout } = authSlice.actions;
// -------------------------
// Store Setup
// -------------------------
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});
store.subscribe(() => {
    saveState(store.getState().auth);
});
