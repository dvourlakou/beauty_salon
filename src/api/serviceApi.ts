import axiosInstance from './axiosConfig';
import type { ServiceCategory, Service} from '../features/services';

export const serviceApi = {
    getCategories: async (): Promise<ServiceCategory[]> => {
        const response = await axiosInstance.get<ServiceCategory[]>('/services/categories');
        return response.data;
    },

    getCategoryById: async (id: number): Promise<ServiceCategory> => {
        const response = await axiosInstance.get<ServiceCategory>(`/services/categories/${id}`);
        return response.data;
    },

    getServiceById: async (id: number): Promise<Service> => {
        const response = await axiosInstance.get<Service>(`/services/${id}`);
        return response.data;
    },

    getServiceByCategory: async (categoryId: number): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>(` /services/category/${categoryId}` );
        return response.data;
    },
};

