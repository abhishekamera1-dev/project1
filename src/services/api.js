import axios from 'axios'

const API_BASE_URL = 'https://backend-nuy0.onrender.com/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    signup: async (email, password) => {
        const response = await api.post('/auth/signup', { email, password })
        return response.data
    },

    login: async (emailOrPhone) => {
        const response = await api.post('/auth/login', { emailOrPhone })
        return response.data
    },

    verifyOTP: async (userId, otp) => {
        const response = await api.post('/auth/verify-otp', { userId, otp })
        return response.data
    }
}

// Products API
export const productsAPI = {
    getAll: async () => {
        const response = await api.get('/products')
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`)
        return response.data
    },

    create: async (productData) => {
        const response = await api.post('/products', productData)
        return response.data
    },

    update: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/products/${id}`)
        return response.data
    },

    toggleStatus: async (id) => {
        const response = await api.patch(`/products/${id}/toggle-status`)
        return response.data
    }
}

// Upload API
export const uploadAPI = {
    uploadImages: async (files) => {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('images', file)
        })

        const response = await axios.post(`${API_BASE_URL}/upload/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    deleteImage: async (filename) => {
        const response = await api.delete(`/upload/delete/${filename}`)
        return response.data
    }
}

// Health check
export const healthCheck = async () => {
    const response = await api.get('/health')
    return response.data
}

export default api
