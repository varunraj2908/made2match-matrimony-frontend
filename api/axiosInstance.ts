import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

const normalizePhotoUrls = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const uploadPath = value.match(/\/api\/v1\/uploads\/photos\/[^?#]+/i)?.[0]
    if (!uploadPath || !apiBaseUrl) return value
    return `${new URL(apiBaseUrl).origin}${uploadPath}`
  }
  if (Array.isArray(value)) return value.map(normalizePhotoUrls)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        normalizePhotoUrls(item),
      ]),
    )
  }
  return value
}

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use((response) => {
  response.data = normalizePhotoUrls(response.data)
  return response
})

export default axiosInstance
