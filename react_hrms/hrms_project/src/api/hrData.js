import axios from 'axios';
export const getHrData = () => {
    const url = `${import.meta.env.VITE_API_BASE }/credentials` 
   
    return (
        axios.get(url, { timeout: 10000 }).then(
            (res)=>{
               
                return res;
            },
            (error) => {
                console.log(error, "Error !!!");
              }
        )
    )
      }


      