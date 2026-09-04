export interface DashboardStats {
    total: number;
    today: number;
    thisWeek: number;
    pending: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Employee {
    id: number;
    name: string;
}

export interface Service {
    id: number;
    name: string;
    price: number;
}


export interface Appointment {
    id: number;
    date: string;
    time: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    User?: User;
    Employee?: Employee;
    Service?: Service;
}

export interface EmployeeWorkload {
    id: number;
    name: string;
    total: number;
    capacity: number;
}
