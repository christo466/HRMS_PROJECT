// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getData } from "../api/designationData";

// const initialState = {
//   status: "idle",
//   data: [],
// };

// export const getDesignationData = createAsyncThunk("designation/getDesignationData", async () => {
//   const response = await getData();
//   console.log(response, "response");
//   return response?.data;
// });

// const designationDataSlice = createSlice({
//   name: "designation",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getDesignationData.pending, (state) => {
//         console.log("pending");
//         state.status = "loading";
//       })
//       .addCase(getDesignationData.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         console.log(action, "Action");
//         state.data = action.payload;
//       })
//       .addCase(getDesignationData.rejected, (state) => {
//         state.status = "failed";
//       });
//   },
// });

// export default designationDataSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDesigData } from "../api/designationData";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const getDesignationData = createAsyncThunk("designation/getDesignationData", async () => {
  const response = await getDesigData();
  // console.log(response, "response");
  return response.data; 
});

const designationDataSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDesignationData.pending, (state) => {
        console.log("pending");
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDesignationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getDesignationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default designationDataSlice.reducer;


