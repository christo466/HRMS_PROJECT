      import axios from 'axios';

export const postDesignationData = (data, successCB, handleError) => {
    const url = `${import.meta.env.VITE_API_BASE}/designation`;
    return axios.post(url, data).then(
        (res) => {
            
            successCB();
            return res.data;
        },
        (error) => {
            
            handleError(error.response.data.status_message);
        }
    );
};
