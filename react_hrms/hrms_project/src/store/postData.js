import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postEmployeeData } from "../api/postEmployee";

const initialState = {
  status: "idle",

  data: [],
};

export const postemployeeData = createAsyncThunk(
  "employeeDatapost",

  async ({ data, successCB, errorCB }) => {
    const response = await postEmployeeData(data, successCB, errorCB);
    return response?.data;
  }
);

const EmployeePostSlice = createSlice({
  name: "EmployeeData",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postemployeeData.pending, (state) => {
       
        state.status = "loading";
      })
      .addCase(postemployeeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
      })
      .addCase(postemployeeData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default EmployeePostSlice.reducer;
