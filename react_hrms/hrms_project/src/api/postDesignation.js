// import axios from 'axios';

// export const postDesignationData = (data,succesCB, handleError) => {
    
//     const url = `${import.meta.env.VITE_API_BASE }/designation` 
//     return (
//         axios.post(url,data).then(
            
//             (res)=>{
                
//                 succesCB()
//                 return res.data;
//             },
//             (error)=>{
//                 console.log(error.response.data.message)
//                 handleError(error.response.data.message)
//             }
//         ))    
// }





      
import axios from 'axios';

export const postDesignationData = (data, successCB, handleError) => {
    const url = `${import.meta.env.VITE_API_BASE}/designation`;
    return axios.post(url, data).then(
        (res) => {
            console.log(res,"adding designation data")
            successCB();
            return res.data;
        },
        (error) => {
            console.log(error.response.data.status_message);
            handleError(error.response.data.status_message);
        }
    );
};
