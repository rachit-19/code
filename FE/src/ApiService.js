import axios from 'axios'
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // You can set a default base URL if needed
})

const ApiService = {
  request: async (method, url, data = null, headers = {}, navigate) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axiosInstance({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers,
        },
      })

      if (response.data.status === 403) {
        toast.error('Forbidden: Redirecting to home')
        navigate('/')
        return // Optionally, you can return here to avoid further processing
      }

      return response.data
    } catch (error) {
      console.error('Error in API request:', error)
      toast.error('API request failed')
      throw error
    }
  },
}

export default ApiService
