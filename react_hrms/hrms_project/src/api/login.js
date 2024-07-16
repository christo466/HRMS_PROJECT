import axios from 'axios';

export const login = (username, password, successCB,handleError ) => {
    const url = `${import.meta.env.VITE_API_BASE}/login`;
  
    return (
        axios.post(url, { username, password }, { timeout: 10000 }).then(
            (res) => {
                
                successCB(res.data.data)
                return res.data; 
            },
            (error) => {
               
                handleError(error.response.data)
            }
        )
    );
}
