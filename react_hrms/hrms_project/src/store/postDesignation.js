import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postDesignationData  } from "../api/postDesignation";

const initialState = {
  status: "idle",

  data: [],
  
};

export const postdesignationData = createAsyncThunk("DesignationDatapost",
   
   async ({data,successCB,errorCB}) => {
  const response = await postDesignationData (data,successCB, errorCB);
  console.log(response.data, "response");
  return response?.data;
});

const DesignationPostSlice = createSlice({
  name: "DesignationData",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postdesignationData.pending, (state) => {
        console.log("pending");
        state.status = "loading";
      })
      .addCase(postdesignationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "Action");
        
        
      })
      .addCase(postdesignationData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default DesignationPostSlice.reducer;