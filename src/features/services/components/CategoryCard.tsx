import {useState} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {ServiceCategory} from '../types';
import {ServiceCard} from './ServiceCard.tsx';

interface CategoryCardProps {
    category: ServiceCategory;
    onSelect: (serviceId: number) => void;
}

export const CategoryCard = ({ category, onSelectService }: CategoryCard) => {
    const [isExpanded, setIsExpanded] = useState(false);

    //Χρήση emoji για πιο όμορφη πλοήγηση στις κατηγορίες υπηρεσιών
    const getCategoryIcon = (name: string)=> {
        const icons: Record<string, string> = {
            'Περιποίηση Νυχιών': '💅',
            'Αποτρίχωση': '👙',
            'Μασάζ': '💆'
        };
        return icons[name] || '📌';
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-white rounded -x1 shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
            {/* Category Header  - clickable to expand-collapse */}
            <button
                onClick={toggleExpand}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <span className="text-3x1">{getCategoryIcon(category.name)}</span>
                    <h2 className="text-x1 font-semibold text-gary-800">{category.name}</h2>
                    <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{category.services?.length || 0} υπηρεσίες </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="text-gary-400" size={24} /> ) : (
                        <ChevronDown className="text-gray-400" size={24} />

                )}
            </button>

            {/* Category content expanded */}
            {isExpanded && (
                <div className="px-6 pb-4 pt-2 border-t border-gray-100">{category.services && category.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{category.services.map((service) => (
                        <ServiceCard
                        key={service.id}
                        service={service}
                        onSelect={() => onSelectService(service.id)}/>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm py-4 text-center">
                        Δεν υπάρχουν διαθέσιμες υπηρεσίες στη συγκεκριμένη κατηγορία.
                    </p>
                )}
                </div>
                )}
        </div>
    );
};
