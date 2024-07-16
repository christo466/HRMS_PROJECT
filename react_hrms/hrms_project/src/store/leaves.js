import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { leavesDataget } from "../api/employeeLeaves";

const initialState = {
  status: "idle",
  series: [],
};

export const getLeavesData = createAsyncThunk("leavesDatagetter", async () => {
  const response = await leavesDataget();
  return response?.data;
});

const leavesDataSlice = createSlice({
  name: "leavesData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase( getLeavesData.pending, (state) => {
       
        state.status = "loading";
      })
      .addCase( getLeavesData.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        state.series = action.payload;
      })
      .addCase( getLeavesData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default leavesDataSlice.reducer;
