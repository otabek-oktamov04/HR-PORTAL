import axios from 'axios';
import router from '@/router';


const apiClient = axios.create({
  baseURL: "https://hrportal.mohirjobs.uz/api",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient