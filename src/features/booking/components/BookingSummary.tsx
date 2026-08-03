import { Service, Employee } from '../types';

interface BookingSummaryProps {
    service: Service;
    date: Date | null;
    time: string| null;
    employee?: Employee;
}

export const BookingSummary = ({
    service,
    date,
    time,
    employee,
}: BookingSummaryProps) => {
    const formDate = (date: Date) => {
        return date.toLocaleDateString('el', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',

        });
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4"> Σύνοψη Κράτησης</h2>

            <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500"> Υπηρεσία</span>
                    <span className="font-medium text-gray-800">{service.name}</span>
                </div>

                {service.durationMinutes && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray 500">Διάρκεια</span>
                        <span className="font-medium text-gray-800">{service.durationMinutes}Λεπτά</span>
                    </div>
                )}

                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray 500">Τιμή</span>
                    <span className="font-medium text-gray-800">{service.price}</span>
                </div>

                {date && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray 500">Ημερομηνία</span>
                        <span className="font-medium text-gray-800">{formDate(date)}</span>
                    </div>
                )}

                {time && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray 500">Ώρα</span>
                        <span className="font-medium text-gray-800">{time}</span>
                    </div>

                )}

                {employee && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray 500">Αισθητικός</span>
                        <span className="font-medium text-gray-800">{employee.name}</span>
                    </div>

                )}
            </div>
        </div>
    );
};


