export interface DashboardStats {
    total: number;
    today: number;
    thisWeek: number;
    pending: number;
}

export interface Appointment {
    id: number;
    date: string;
    time: string;
    serviceName: string;
    employeeName: string;
    customerName: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface EmployeeWorkload {
    id: number;
    name: string;
    total: number;
    capacity: number;
}
