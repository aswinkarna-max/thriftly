import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends cookies with every request
})

export default instance