import axios from "axios";
import {BASE_URL} from "./endpoints";
import api from "./index";

const AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
});

AxiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

AxiosInstance.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !originalRequest._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await api.auth.Refresh();
            localStorage.setItem('token', response.data.access_token);
            return AxiosInstance.request(originalRequest)
        } catch (e) {
            console.error('Пользователь не авторизован')
        }
    }
})

export default AxiosInstance