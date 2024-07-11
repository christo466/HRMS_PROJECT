import { configureStore } from "@reduxjs/toolkit";
import hrmsReducer from "./hrms";
import  loginReducer from "./login"
import  designationReducer from "./designation"
import postReducer from "./postData"
import logoutReducer from "./logout"
import updateReducer from "./updateEmployee"
import desigAddReducer from "./postDesignation"
import deletedesigReducer from "./deleteDesig"
import deleteEmployeeReducer from "./deleteEmployee"
export const store = configureStore({
  reducer: {
    hrms: hrmsReducer,
    auth: loginReducer,
    designation: designationReducer,
    post:postReducer,
    logout:logoutReducer,
    update:updateReducer,
    updesignation:desigAddReducer,
    deletedesig:deletedesigReducer,
    deleteemployee:deleteEmployeeReducer 
  },
});