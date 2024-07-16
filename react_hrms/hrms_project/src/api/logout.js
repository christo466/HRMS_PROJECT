

import axios from 'axios';

export const logoutApi = () => {
    const url = `${import.meta.env.VITE_API_BASE}/logout`;
    return axios.post(url).then(
        (res) => {
           
            return res.data; 
        },
        (error) => {
            console.log(error, "Error !!! logout ");
           
        }
    );
}
