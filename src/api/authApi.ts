import axiosInstance from './axiosConfig';

interface RegisterData {
    email: string;
    name: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: 'CUSTOMER' | 'ADMIN' | 'EMPLOYEE';
    };
}

export const authApi = {
    register: async (data: RegisterData): Promise<void> => {
        await axiosInstance.post('/auth/register', data);
    },

    login: async (email:string, password:string):Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', {email, password});
        return response.data;



    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout');
        localStorage.removeItem('token');
    },

    getMe: async(): Promise<LoginResponse['user']> => {
        const response = await axiosInstance.get<LoginResponse['user']>('/auth/me');
        return response.data;

    },



};
