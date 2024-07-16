import axios from 'axios';

export const postEmployeeData = (data,succesCB,handleError) => {
    
    const url = `${import.meta.env.VITE_API_BASE }/employee` 
    return (
        axios.post(url,data).then(
            
            (res)=>{
                
                succesCB()
                return res.data;
            },
            (error)=>{
                
                handleError(error.response.data)
                
            }
        ))    
}





      