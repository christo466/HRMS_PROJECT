import axios from 'axios';

export const deleteEmployee = (id) => {
  const url = `${import.meta.env.VITE_API_BASE}/employee/delete/${id}`;
  return axios.delete(url).then(
    (res) => {
      return res;
    },
    (error) => {
      console.error("Error deleting employee:", error);
    }
  );
};
