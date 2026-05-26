import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

// Configuração da instância do Axios para rotas gerais protegidas
export const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// Interceptador para injetar token Bearer globalmente em chamadas usando "api"
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const AuthService = {
    async login(identificacaoUsuario, senha) {
        const response = await axios.post(`${API_URL}/login`, { identificacaoUsuario, senha });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async register(identificacaoUsuario, senha) {
        const response = await axios.post(`${API_URL}/register`, { identificacaoUsuario, senha });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

export default AuthService;