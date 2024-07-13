
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateEmployeeDetails, updateEmployeeLeaves } from '../api/updateEmployee';

// Async action to update employee details
export const updateEmployee = createAsyncThunk(
  'hrms/updateEmployee',
  async ({data,successCB}) => {
    const response = await updateEmployeeDetails (data,successCB);
//   console.log(response.data, "response");
  return response?.data;
  }
);

// Async action to update employee leaves
export const updateLeavesTaken = createAsyncThunk(
  'hrms/updateLeavesTaken',
  async ({id,data,successCB}) => {
    const response = await updateEmployeeLeaves (id,data,successCB);
//   console.log(response.data, "response");
  return response?.data;
  }
);

const hrmsSlice = createSlice({
  name: 'hrms',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.data.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateLeavesTaken.fulfilled, (state, action) => {
        const index = state.data.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.data[index].leaves_taken = action.payload.leaves_taken;
        }
      })
      .addCase(updateLeavesTaken.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { actions, reducer } = hrmsSlice;
export default hrmsSlice.reducer;
