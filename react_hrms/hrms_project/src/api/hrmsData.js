// import axios from 'axios';
// export const getData = () => {
//     const url = `${import.meta.env.VITE_API_BASE }/employees` 
//     console.log("getData called")
//     return (
//         axios.get(url, { timeout: 10000 }).then(
//             (res)=>{
//                 console.log(res,"res")
//                 return res;
//             },
//             (error) => {
//                 console.log(error, "Error !!!");
//               }
//         )
//     )
//       }


      

import axios from 'axios';

export const getData = () => {
    const url = `${import.meta.env.VITE_API_BASE}/employees`;
    console.log("getEmployeeData called");

    return axios.get(url, { timeout: 10000 }).then(
        (res) => {
            if (res.data.status) {
                console.log(res.data, "Employee Data");
                return res.data;
            } else {
                throw new Error(res.data.status_message);
            }
        },
        (error) => {
            console.log(error.message, "Error fetching employee data");
            throw error;
        }
    );
};
