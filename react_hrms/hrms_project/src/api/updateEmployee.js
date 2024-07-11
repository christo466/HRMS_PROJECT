
import axios from 'axios';

// Function to update employee details
export const updateEmployeeDetails = (data, successCB) => {
  const url = `${import.meta.env.VITE_API_BASE}/employees/${data.id}`;
  return axios.put(url, data).then(
    (res) => {
      successCB();
      return res.data;
    },
    (error) => {
    //   
    console.log("error",error)
    }
  );
};

// Function to update employee leaves
export const updateEmployeeLeaves = (em_id, data, successCB) => {
    let id = parseInt(em_id);
  console.log("leaves:",data)
  const url = `${import.meta.env.VITE_API_BASE}/employees/${id}/leaves`;
  return axios.put(url, { leave_taken: data}, { headers: { 'Content-Type': 'application/json' } } ).then(
    (res) => {
      successCB();
      return res.data;
    },
    (error) => {
      console.log("error", error)
    }
  );
};
