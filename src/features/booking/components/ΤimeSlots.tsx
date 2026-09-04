import { Clock } from 'lucide-react';

interface TimeSlotsProps {
    slots: string[];
    selectedTime: string | null;
    onSelectedTime: (time: string) => void;
}

//Η δημιουργία όλων των διαθέσιμων ωρών μεταξύ 10:00 - 20:00
const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 10; hour <= 20; hour++) {
        const hourStr = hour.toString().padStart(2,'0');
        slots.push(`${hourStr}:00`);
        if (hour < 20) {
            slots.push(`${hourStr}:30`);
        }
    }
    return slots;
};

//Όλες οι διαθέσιμες ώρες (σταθερές)
const ALL_TIME_SLOTS = generateTimeSlots();

export const TimeSlots = ({ slots, selectedTime, onSelectedTime }: TimeSlotsProps) => {

    //Αν δεν υπάρχουν διαθέσιμες ώρες θέλω να εμφανίζεται μήνυμα στο user
    if (slots.length === 0) {
        return (
            <div className="text-center py-6 text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p>Δεν υπάρχουν διαθέσιμες ώρες τη συγκεκριμένη μέρα</p>
            </div>
        );

    }

    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">{ALL_TIME_SLOTS.map((time) => {
            //Έλεγχος αν η ώρα είναι διαθέσιμη
            const isAvailable = slots.includes(time);
            const isSelected = selectedTime === time;

            return (
                <button
                    key={time}
                    onClick={() => {
                        if (isAvailable) {
                            onSelectedTime(time);
                        }
                    }}
                    disabled={!isAvailable}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-pink-300 text-white shadow-md' : isAvailable ? 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:border-pink-200 border border-transparent' : 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'}`}>
                    {time}
                </button>
            );
        })}
        </div>
    );
};

