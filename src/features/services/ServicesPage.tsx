import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CategoryCard } from './components/CategoryCard.tsx';
import { mockCategories } from "./mockData.ts";
import { ServiceCategory } from './types.ts';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner.tsx';

export const ServicesPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        //Προσομοίωση φόρτωσης από το API
        const loadCategories = () => {
            setTimeout(() => {
                setCategories(mockCategories);
                setLoading(false);
            },500);
        };
        loadCategories();
    }, []);

    const handleSelectService = (serviceId: number) => {
        navigate(`/booking?service=${serviceId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-4xl mx-auto">{/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Οι Υπηρεσίες μας</h1>
                    <p className="text-gray-500 mt-1">Επιλέξτε την υπηρεσία που επιθυμείτε</p>
                </div>

                {/* categories grid */}
                <div className="space-y-4">{categories.map((category) => (
                    <CategoryCard
                    key={category.id}
                    category={category}
                    onSelectService={handleSelectService}
                    />

                ))}
                </div>
            </div>
        </div>
    );
};
