import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteEmployee } from "../api/deleteEmployee";

const initialState = {
  status: "idle",
  error: null,
};

export const deleteEmployeeData = createAsyncThunk("employee/deleteEmployeeData", async (id) => {
  const response = await deleteEmployee(id);
  return response.data;
});

const deleteEmployeeSlice = createSlice({
  name: "deleteEmployee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteEmployeeData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteEmployeeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
        state.error = null;
      })
      .addCase(deleteEmployeeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default deleteEmployeeSlice.reducer;
