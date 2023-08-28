import axios from "axios";
import {BASE_URL} from "./endpoints";

const AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
});

AxiosInstance.interceptors.response.use((config) => {
    return config
}, async (error) => {
    if (error.response.status === 401) {
        const protocol = window.location.protocol;
        const host = window.location.host

        window.location.replace(`${protocol}//${host}/login`)
    }
})

export default AxiosInstance