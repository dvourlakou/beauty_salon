import { Service } from "../types.ts";

interface ServiceCardProps {
    service: Service;
    onSelect: () => void;

}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-50 transition-colors border border-gray-50 hover:border-pink-200">
            <div className="flex-1">
                <h3 className="font-medium text-gray-800">{service.name}</h3>
                {service.description && (
                    <p className="text-sm text-gray-400">{service.description}</p>
                )}
                {/* ΜΟΝΟ αν έχω μασάζ, δηλαδή υπάρχει το durationMinutes */}
                {service.durationMinutes && (
                    <span className="text-xs text-gray-400">
                        {service.durationMinutes} λεπτά
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-pink-400">
                    {service.price}€
                </span>
                <button
                    onClick={onSelect}
                    className="px-4 py-2 text-sm font-medium text-white bg-pink-300 rounded-lg hover:bg-pink-400 transition-colors">
                    Επιλογή
                </button>
            </div>
        </div>
    );
};

