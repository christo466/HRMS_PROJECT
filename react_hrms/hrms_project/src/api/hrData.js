import axios from 'axios';
export const getHrData = () => {
    const url = `${import.meta.env.VITE_API_BASE }/credentials` 
    console.log("getData called")
    return (
        axios.get(url, { timeout: 10000 }).then(
            (res)=>{
                console.log(res,"res of hr data")
                return res;
            },
            (error) => {
                console.log(error, "Error !!!");
              }
        )
    )
      }


      