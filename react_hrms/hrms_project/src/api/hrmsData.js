import axios from 'axios';
export const getData = () => {
    const url = `${import.meta.env.VITE_API_BASE }/employees` 
    console.log("getData called")
    return (
        axios.get(url, { timeout: 10000 }).then(
            (res)=>{
                console.log(res,"res")
                return res;
            },
            (error) => {
                console.log(error, "Error !!!");
              }
        )
    )
      }


      