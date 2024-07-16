import axios from 'axios';

export const getData = () => {
    const url = `${import.meta.env.VITE_API_BASE}/employees`;
    

    return axios.get(url, { timeout: 10000 }).then(
        (res) => {
            if (res.data.status) {
                
                return res.data;
            } 
        },
        (error) => {
            console.log(error.message, "Error fetching employee data");
            throw error;
        }
    );
};
