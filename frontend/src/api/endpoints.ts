export const Endpoints = {
    AUTH: {
        LOGIN: '/users/login',
        REFRESH: '/users/refresh',
        LOGOUT: '/users/logout',
        REGISTER: '/users/register',
    },
    TODOS: {
        ALL: '/todos',
        TODO: '/todos/todo'
    }
};

export const BASE_URL = 'http://' + window.location.host + '/api';