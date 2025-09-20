import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice.js';

export const store = configureStore({
    reducer: {
        chat: chatReducer
    }
});

export default store;