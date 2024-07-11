import axios from 'axios';

export const deleteDesignationData = (id,successCB) => {
    const url = `${import.meta.env.VITE_API_BASE}/designation/delete/${id}`;
    console.log("deleteDesignationData called");
    return (
        axios.delete(url).then(
            (res) => {
                console.log(res, "res");
                successCB()
                return res;
            },
            (error) => {
                console.log(error, "Error !!!");
                
            }
        )
    );
};
