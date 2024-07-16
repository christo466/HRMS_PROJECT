import axios from 'axios';

export const getDesigData = () => {
    const url = `${import.meta.env.VITE_API_BASE}/designations`;
    
    return axios.get(url).then(
        (res) => {
            console.log(res, "res");
            return res.data;
        },
        (error) => {
            console.log(error, "Error !!!");
        }
    );
};
