import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAsyncPending = createAsyncThunk('student/fetchAsyncPending', async () => {
    const response = await axios.get('/student/getpendingassignments', {withCredentials: true});
    return response.data.data;
});

export const fetchAsyncChecked = createAsyncThunk('student/fetchAsyncChecked', async () => {
    const response = await axios.get('/student/getcompletedassignments', {withCredentials: true});
    return response.data.data;
});

export const fetchAsyncSubmitted = createAsyncThunk('student/fetchAsyncSubmitted', async () => {
    const response = await axios.get('/student/getsubmittedassignments', {withCredentials: true});
    return response.data.data;
})

export const fetchAsyncRedo = createAsyncThunk('student/fetchAsyncRedo', async () => {
    const response = await axios.get('/student/getredoassignments', {withCredentials: true});
    return response.data.data;
})

const initialState = {
    navbar: 'pending',
    pending: [],
    checked: [],
    submitted: [],
    redo: [],
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setNavbar: (state, {payload}) => {
            state.navbar = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncPending.fulfilled, (state, { payload }) => {
            state.pending = payload;
        });
        builder.addCase(fetchAsyncChecked.fulfilled, (state, { payload }) => {
            state.checked = payload;
        });
        builder.addCase(fetchAsyncSubmitted.fulfilled, (state, { payload }) => {
            state.submitted = payload;
        });
        builder.addCase(fetchAsyncRedo.fulfilled, (state, { payload }) => {
            state.redo = payload;
        });
    }
})

export const {setNavbar} = studentSlice.actions;
export const getNavbar = (state) => state.student.navbar;
export const getPending = (state) => state.student.pending; 
export const getChecked = (state) => state.student.checked;
export const getSubmitted = (state) => state.student.submitted;
export const getRedo = (state) => state.student.redo;

export default studentSlice.reducer;