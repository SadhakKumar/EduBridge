import {configureStore} from '@reduxjs/toolkit';
import studentReducer from './student/studentSlice';
import userReducer from './user/userSlice';
import teacherReducer from './teacher/teacherSlice';

export const store = configureStore({
    reducer: {
        student: studentReducer,
        user: userReducer,
        teacher: teacherReducer,
    },
});