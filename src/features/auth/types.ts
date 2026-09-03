export type User = {
    id:number;
    email: string;
    name: string;
    role : 'CUSTOMER' | 'ADMIN' | 'EMPLOYEE';
};

export type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email:string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
};

export type RegisterData = {
    email: string;
    name: string;
    phone: string;
    password: string;
};
