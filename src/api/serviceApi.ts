import axiosInstance from './axiosConfig';
import type { ServiceCategory, Service} from '../features/services';

export const serviceApi = {
    getCategories: async (): Promise<ServiceCategory[]> => {
        const response = await axiosInstance.get<ServiceCategory[]>('/services/categories');
        return response.data;
    },

    getCategoryById: async (id: number): Promise<ServiceCategory> => {
        const url = `http://localhost:5173/api/v1/categories/${id}`;
        const response = await axiosInstance.get<ServiceCategory>(url, {
            headers : {
                "Content - Type" : "application/json",
            },
        });
        return response.data;
    },

    getServiceById: async (id: number): Promise<Service> => {
        const response = await axiosInstance.get<Service>(`/services/${id}`);
        return response.data;
    },

    getServiceByCategory: async (categoryId: number): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>(`/services/category/${categoryId}`);
        return response.data;
    },
};

