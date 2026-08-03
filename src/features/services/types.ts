export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    durationMinutes?: number; // μόνο εφόσον η υπηρεσία είναι το μασάζ
    categoryId: number;
    isActive: boolean;

}


export interface ServiceCategory {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    services?: Service[];
    isActive: boolean;

}
