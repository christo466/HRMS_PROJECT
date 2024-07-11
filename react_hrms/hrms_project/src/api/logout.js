

import axios from 'axios';

export const logoutApi = () => {
    const url = `${import.meta.env.VITE_API_BASE}/logout`;
    return axios.post(url, {}, { timeout: 10000 }).then(
        (res) => {
            console.log(res, "res");
            return res.data; 
        },
        (error) => {
            console.log(error, "Error !!!");
            throw error; 
        }
    );
}
