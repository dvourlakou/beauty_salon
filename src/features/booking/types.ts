export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    durationMinutes?: number;
    categoryId: number;
}

export interface Employee {
    id: number;
    name: string;
    specialization: string;
    imageUrl?: string;
}

export interface BookingDetails {
    serviceId: number;
    date: string;
    time: string;
    employeeId?: number;
}

export interface BookingConfirmationData {
    serviceName: string;
    date: string;
    time: string;
    employeeName?: string;
    price: number;
    email: string;

}