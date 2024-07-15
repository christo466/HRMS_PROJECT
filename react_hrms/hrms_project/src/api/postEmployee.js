import axios from 'axios';

export const postEmployeeData = (data,succesCB,handleError) => {
    
    const url = `${import.meta.env.VITE_API_BASE }/employee` 
    return (
        axios.post(url,data).then(
            
            (res)=>{
                console.log(res.data,"employee add response")
                succesCB()
                return res.data;
            },
            (error)=>{
                console.log(error,"employee post error")
                handleError(error.response.data)
                
            }
        ))    
}





      