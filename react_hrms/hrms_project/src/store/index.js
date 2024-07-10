import { configureStore } from "@reduxjs/toolkit";
import hrmsReducer from "./hrms";
import  loginReducer from "./login"
import  designationReducer from "./designation"
import postReducer from "./postData"
export const store = configureStore({
  reducer: {
    hrms: hrmsReducer,
    auth: loginReducer,
    designation: designationReducer,
    post:postReducer 

  },
});