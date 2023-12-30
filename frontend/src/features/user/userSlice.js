import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAsyncRole = createAsyncThunk('user/fetchAsyncRole', async () => {
    const res = await axios.get('/user/getuser', {withCredentials: true});
    return res.data.decodedToken.role;
})

const initialState = {
    role: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchAsyncRole.fulfilled, (state, { payload }) => {
        state.role = payload;
      });
    },
  });

export const getRole = (state) => state.user.role;
export default userSlice.reducer;
