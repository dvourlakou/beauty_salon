import { ServiceCategory } from './types';

export const mockCategories: ServiceCategory[] = [
    {
        id: 1,
        name: 'Περιποίηση Νυχιών',
        description: 'Μανικιούρ και Πεντικιούρ',
        services: [
            { id: 1, name: 'Μανικιούρ - Απλό', price: 18, categoryId: 1, isActive: true },
            { id: 2, name: 'Μανικιούρ - Γαλλικό', price: 20, categoryId: 1, isActive: true },
            { id: 3, name: 'Μανικιούρ - Ημιμόνιμο', price: 25, categoryId: 1, isActive: true },
            { id: 4, name: 'Μανικιούρ - Τεχνητά', price: 30, categoryId: 1, isActive: true },
            { id: 5, name: 'Μανικιούρ - Συντήρηση Ημιμόνιμο', price: 20, categoryId: 1, isActive: true },
            { id: 6, name: 'Μανικιούρ - Συντήρηση Τεχνητά', price: 28, categoryId: 1, isActive: true },
            { id: 7, name: 'Πεντικιούρ - Απλό', price: 15, categoryId: 1, isActive: true },
            { id: 8, name: 'Πεντικιούρ - Γαλλικό', price: 18, categoryId: 1, isActive: true },
            { id: 9, name: 'Πεντικιούρ- Ημιμόνιμο', price: 22, categoryId: 1, isActive: true },
            { id: 10, name: 'Πεντικιούρ - Τεχνητά', price: 25, categoryId: 1, isActive: true },
            { id: 11, name: 'Πεντικιούρ - Συντήρηση Ημιμόνιμο', price: 20, categoryId: 1, isActive: true },
            { id: 12, name: 'Πεντικιούρ - Συντήρηση Τεχνητά', price: 22, categoryId: 1, isActive: true },
        ],
        isActive: true,
    },
    {
        id: 2,
        name: 'Αποτρίχωση',
        description: 'Αποτρίχωση με κερί',
        services: [
            { id:13, name: 'Μπικίνι', price: 40, categoryId: 2, isActive: true },
            { id:14, name: 'Χέρια', price: 20, categoryId: 2, isActive: true },
            { id:15, name: 'Πόδια', price: 30, categoryId: 2, isActive: true },
        ],
        isActive: true,
    },
    {
        id: 3,
        name: 'Μασάζ',
        description: 'Μασάζ χαλάρωσης και ευεξίας',
        services: [
            { id:16, name: 'Full Body 60λεπτά', price: 28,durationMinutes: 60, categoryId: 3, isActive: true },
            { id:17, name: 'Full Body 45λεπτά', price: 25,durationMinutes:45, categoryId: 3, isActive: true },
            { id:18, name: 'Πλάτη', price: 15, durationMinutes: 30, categoryId: 3, isActive: true },
            { id:19, name: 'Κεφάλι', price: 18, durationMinutes:30, categoryId: 3, isActive: true },
            { id:20, name: 'Πόδια', price: 20, durationMinutes:30, categoryId: 3, isActive: true },
        ],
        isActive: true,

    },

];
