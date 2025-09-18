import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatslice';
export const store = configureStore({
    reducer: {
        chat: chatReducer
    }
});

export default store;