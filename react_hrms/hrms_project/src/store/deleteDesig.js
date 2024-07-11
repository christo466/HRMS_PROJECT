import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDesignationData } from "../api/deleteDesignation";

const initialState = {
  status: "idle",
  error: null,
};

export const deleteDesignation = createAsyncThunk(
  "designation/deleteDesignation",
  async ({id, successCB }) => {
   
      const response = await deleteDesignationData(id,successCB);
      return response.data;
   
  }
);

const deleteDesignationSlice = createSlice({
  name: "deleteDesignation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteDesignation.pending, (state) => {
        console.log("pending");
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
        state.error = null;
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default deleteDesignationSlice.reducer;
