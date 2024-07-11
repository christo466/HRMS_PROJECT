import axios from 'axios';


export const updateDesignationDetails = (data, successCB) => {
  const url = `${import.meta.env.VITE_API_BASE}/designation/${data.id}`;
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