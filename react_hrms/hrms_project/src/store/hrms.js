import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getData } from "../api/hrmsData";

const initialState = {
  status: "idle",
  data: [],
};

export const getHrmsData = createAsyncThunk("hrmsDatagetter", async () => {
  const response = await getData();
  // console.log(response, "response");
  return response?.data;
});

const hrmsDataSlice = createSlice({
  name: "hrmsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHrmsData.pending, (state) => {
        console.log("pending");
        state.status = "loading";
      })
      .addCase(getHrmsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
        state.data = action.payload;
      })
      .addCase(getHrmsData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default hrmsDataSlice.reducer;
