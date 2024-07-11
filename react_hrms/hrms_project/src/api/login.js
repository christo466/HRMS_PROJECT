import axios from 'axios';

export const login = (username, password, successCB,handleError ) => {
    const url = `${import.meta.env.VITE_API_BASE}/login`;
    console.log("login called with email:", username);
    return (
        axios.post(url, { username, password }, { timeout: 10000 }).then(
            (res) => {
                console.log(res, "res");
                successCB()
                return res.data; 
            },
            (error) => {
                console.log(error, "Error !!!");
                handleError(error.response.data)
            }
        )
    );
}
