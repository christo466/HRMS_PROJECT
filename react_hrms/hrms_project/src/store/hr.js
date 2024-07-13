import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHrData } from "../api/hrData";

const initialState = {
  status: "idle",
  data: [],
};

export const gethrData = createAsyncThunk("hrDatagetter", async () => {
  const response = await getHrData();
//   console.log(response, "response");
  return response?.data;
});

const hrDataSlice = createSlice({
  name: "hrData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(gethrData.pending, (state) => {
        console.log("pending");
        state.status = "loading";
      })
      .addCase(gethrData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.meta.arg, "Action hr");
        state.data = action.meta.arg;
      })
      .addCase(gethrData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default hrDataSlice.reducer;
