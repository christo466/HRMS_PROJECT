import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getData } from "../api/hrmsData";

const initialState = {
  status: "idle",
  data: [],
};

export const getHrmsData = createAsyncThunk("hrmsDatagetter", async () => {
  const response = await getData();
  return response?.data;
});

const hrmsDataSlice = createSlice({
  name: "hrmsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHrmsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHrmsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      
      })
      .addCase(getHrmsData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default hrmsDataSlice.reducer;
