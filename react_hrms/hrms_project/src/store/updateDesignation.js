import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateDesignationDetails } from "../api/updateDesignation";


export const updateDesignation = createAsyncThunk(
  "hrms/updateDesignation",
  async ({ data, successCB ,errorCB}) => {
    const response = await updateDesignationDetails(data, successCB, errorCB);
    return response?.data;
  }
);
const hrmsSlice = createSlice({
  name: "designation",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { actions, reducer } = hrmsSlice;
export default hrmsSlice.reducer;
