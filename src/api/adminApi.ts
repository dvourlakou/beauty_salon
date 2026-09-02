import axiosInstance from './axiosConfig';
import type {ServiceCategory, Service} from '../features/services';
import type {Employee} from '../features/booking';
import type {DashboardStats, Appointment, EmployeeWorkload} from '../features/admin';

export const adminApi = {

    //Dashboard
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get<DashboardStats>('/admin/stats');
        return response.data;
    },

    getWeeklyAppointments: async (): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>('/admin/appointments/week');
        return response.data;
    },

    getEmployeeWorkload: async (): Promise<EmployeeWorkload[]> => {
        const response = await axiosInstance.get<EmployeeWorkload[]>('/admin/employees/workload');
        return response.data;
    },

    completeAppointment: async (id: number): Promise<void> => {
        await axiosInstance.patch(`/admin/appointments/${id}/complete`);
    },


    //Services
    getAllServices: async (): Promise<ServiceCategory[]> => {
        const response = await axiosInstance.get<ServiceCategory[]>('/admin/services');
        return response.data;
    },

    createService: async (data: {
        name: string;
        price: number;
        categoryId: number
        description?: string;
        durationMinutes?: number
    }): Promise<Service> => {
        const response = await axiosInstance.post<Service>('/admin/services', data);
        return response.data;
    },

    updateService: async (id: number,data: Partial<Service>): Promise<Service> => {
        const response = await axiosInstance.put<Service>(`/admin/services/${id}`, data);
        return response.data;
    },

    deleteService: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/admin/services/${id}`);

    },


    //Employees
    getAllEmployees: async (): Promise<Employee[]> => {
        const response = await axiosInstance.get<Employee[]>('/admin/employees');
        return response.data;
    },

    createEmployee: async (data: { name: string; specialization: string}): Promise<Employee> => {
        const response = await axiosInstance.post<Employee>('/admin/employees', data);
        return response.data;
    },

    updateEmployee: async (id: number,data: Partial<Employee>): Promise<Employee> => {
        const response = await axiosInstance.put<Employee>(`/admin/employees/${id}`, data);
        return response.data;
    },

    deleteEmployee: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/admin/employees/${id}`);

    }

};
