import axiosInstance from './axiosConfig';
import  {BookingDetails} from '../features/booking/types';

export const appointmentApi = {
    getAvailableSlots: async (
        serviceId: number,
        date: string,
        employeeId?: number
    ) : Promise<string[]> => {
        const params = new URLSearchParams({
            serviceId: serviceId.toString(),
            date,
        });

        if (employeeId) {
            params.append('employeeId',employeeId.toString());
        }
        const response = await axiosInstance.get<string[]>(`/appointments/slots?${params}`);
        return response.data;
    },

    getEmployeeByService: async (serviceId: number): Promise<Employee[]> => {
        const response = await axiosInstance.get<Employee[]>(`/employees/services/${serviceId}`);
        return response.data;
    },

    createBooking: async (data: BookingDetails): Promise<void> => {
        await axiosInstance.post('/appointments', data);
    },

    getMyAppointments: async (): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>('/appointments/my');
        return response.data;
    },


};
