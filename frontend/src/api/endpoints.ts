export const Endpoints = {
  AUTH: {
    ROOT: '/users',
    USER: '/users/user',
    LOGIN: '/users/login',
    REFRESH: '/users/refresh',
    LOGOUT: '/users/logout',
    REGISTER: '/users/register',
  },
  TODOS: {
    ALL: '/todos',
    TODO: '/todos/todo',
  },
};

export const BASE_URL = window.location.protocol + '//' + window.location.host + '/api';
