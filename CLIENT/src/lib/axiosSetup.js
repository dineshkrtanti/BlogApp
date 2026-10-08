import axios from 'axios';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem('token')) {
            window.dispatchEvent(new Event('auth:expired'));
        }
        return Promise.reject(error);
    }
);
