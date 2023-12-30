import {configureStore} from '@reduxjs/toolkit';
import studentReducer from './student/studentSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
    reducer: {
        student: studentReducer,
        user: userReducer,
    },
});