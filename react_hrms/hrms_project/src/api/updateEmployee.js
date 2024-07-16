import axios from 'axios';

export const updateEmployeeDetails = (data, successCB, errorCB) => {
  const url = `${import.meta.env.VITE_API_BASE}/employees/${data.id}`;
  return axios.put(url, data).then(
    (res) => {
      successCB();
      
      return res.data;
    },
    (error) => {
        
        errorCB(error.response.data.status_message)
    }
  );
};

export const updateEmployeeLeaves = (em_id, data, successCB, errorCB) => {
    let id = parseInt(em_id);
  
  const url = `${import.meta.env.VITE_API_BASE}/employees/${id}/leaves`;
  return axios.put(url, { leave_taken: data}, { headers: { 'Content-Type': 'application/json' } } ).then(
    (res) => {
      successCB();
      return res.data;
    },
    (error) => {
      
      errorCB(error)
    }
  );
};
