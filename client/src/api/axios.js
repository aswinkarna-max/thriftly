import axios from 'axios'
 
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // sends cookies with every request
})
 
export default instance
