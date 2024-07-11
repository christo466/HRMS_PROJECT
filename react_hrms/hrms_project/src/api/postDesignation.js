import axios from 'axios';

export const postDesignationData = (data,succesCB, handleError) => {
    
    const url = `${import.meta.env.VITE_API_BASE }/designation` 
    return (
        axios.post(url,data).then(
            
            (res)=>{
                
                succesCB()
                return res.data;
            },
            (error)=>{
                console.log(error.response.data.message)
                handleError(error.response.data.message)
            }
        ))    
}





      