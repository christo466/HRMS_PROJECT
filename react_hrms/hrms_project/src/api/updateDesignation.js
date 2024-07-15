import axios from 'axios';


export const updateDesignationDetails = (data, successCB,errorCB) => {
  const url = `${import.meta.env.VITE_API_BASE}/designation/${data.id}`;
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