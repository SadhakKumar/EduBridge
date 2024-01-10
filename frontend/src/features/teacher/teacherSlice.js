import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAssignments = createAsyncThunk(
    'teacher/fetchAssignments',
    async () => {
        const response = await axios.get('/teacher/getAllAssignment', {withCredentials: true});
        console.log(response.data.assignments)
        return response.data.assignments;
    }
); 

export const fetchAssignmentResponse = createAsyncThunk(
    'teacher/fetchAssignmentResponse',
    async (id) => {
        const response = await axios.post('/teacher/getAllResponses',
         JSON.stringify({assignment_id : id}),{
            headers: {'content-type': 'application/json'},
            withCredentials: true
        });
        console.log(response.data.responses)
        return response.data.responses;
    }
);

export const fetchCorrectedAssignments = createAsyncThunk(
    'teacher/fetchCorrectedAssignments',
    async (id) => {
        const response = await axios.post('/teacher/getAllCorrected', JSON.stringify({assignment_id : id}),{
            headers: {'content-type': 'application/json'},
            withCredentials: true
        });
        console.log(response.data.corrections)
        return response.data.corrections;
    }
);

const initialState = {
    navbar: 'response',
    assignments: [],
    response: [],
    corrected: []
}

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setNavbar: (state, action) => {
            state.navbar = action.payload;
        },
        clearTeacher: (state) => {
            state.navbar = 'response';
            state.assignments = [];
            state.response = [];
            state.corrected = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAssignments.fulfilled, (state, action) => {
            state.assignments = action.payload;
        })
        builder.addCase(fetchAssignmentResponse.fulfilled, (state, action) => {
            state.response = action.payload;
        })
        builder.addCase(fetchCorrectedAssignments.fulfilled, (state, action) => {
            state.corrected = action.payload;
        })
    }
})

export const { setNavbar, clearTeacher } = teacherSlice.actions;
export const getNavbar = (state) => state.teacher.navbar;
export const getAssignment = (state) => state.teacher.assignments;
export const getResponse = (state) => state.teacher.response;
export const getCorrected = (state) => state.teacher.corrected;
export default teacherSlice.reducer;