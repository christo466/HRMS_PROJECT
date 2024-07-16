import axios from 'axios';

export const leavesDataget = async () => {
   
  const url = `${import.meta.env.VITE_API_BASE}/leaves`;
  return (
    axios.get(url).then(
        (res)=>{
           
            return res;
        },
        (error) => {
            console.log(error, "Error !!!");
          }
    )
)
  }
