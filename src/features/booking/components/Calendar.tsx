import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date:Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export const Calendar = ({
    selectedDate,
    onSelectDate,
    minDate = new Date(),
    maxDate,
}: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState( new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month =date.getMonth();
        const firstDay = new Date(year,month, 1).getDay();
        const daysInMonth = new Date(year,month+1,0).getDate();

        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
    const today = new Date();
    today.setHours(0,0,0,0);

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        date.setHours(0,0,0,0);

        //έλεγχος για παλιές ημερομηνίες
        if (date < today) return true;
        //έλγχος για maxDate εφόσον υπάρχει
        if (maxDate && date > maxDate) return true;
        //έλεγχος για Σαββατοκύριακο και μη δυνατότητα κλεισίματος ραντεβου με 0=Κυριακή, 6=Σάββατο
        const dayOfWeek = date.getDay();
        if (dayOfWeek ===0 || dayOfWeek ===6) return true;

        return false;
    };

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    const changeMonth = (delta: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + delta);
        setCurrentMonth(newMonth);
    };

    const weekDays  = ['ΔΕ', 'ΤΡ', 'ΤΕ', 'ΠΕ', 'ΠΑ', 'ΣΑ', 'ΚΥ'];
    const blanks = Array(firstDay === 0 ? 6 : firstDay -1).fill(null);

    return (
       <div>
           {/* month navigation */ }
           <div className="flex items-center justify-between mb-4">
               <button
                   onClick={() => changeMonth(-1)}
                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                   <ChevronLeft size={20} />
               </button>
               <span className="text-lg font-semibold text-gray-700">{currentMonth.toLocaleString('el', {month: 'long', year: 'numeric'})}</span>
               <button
                   onClick={() => changeMonth(1)}
                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                   <ChevronRight size={20} />
               </button>
           </div>

           {/* week days header */ }
           <div className="grid grid-cols-7 gap-1 mb-2">{weekDays.map((day) => (
               <div
               key={day}
               className="text-center text-sm font-medium text-gray-400 py-1">{day}
               </div>
           ))}

           </div>

           {/* days grid */ }
           <div className="grid grid-cols-7 gap-1">{blanks.map((_,index) => (
               <div key={`blank-${index}`} className="h-12" />
           ))}
               {Array.from({ length: daysInMonth}, (_,i) => i+1).map((day) => {
                   const disabled = isDateDisabled(day);
                   const selected = isDateSelected(day);

                   return (
                       <button
                           key={day}
                           onClick={() => {
                               if (!disabled) {
                                   const date = new Date(
                                       currentMonth.getFullYear(),
                                       currentMonth.getMonth(),
                                       day
                                   );
                                   onSelectDate(date);
                           }
                           }}
                           disabled={disabled}
                           className={`
                h-12 w-full rounded-lg text-sm font-medium transition-colors
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-pink-50'}
                ${selected ? 'bg-pink-300 text-white hover:bg-pink-400' : 'text-gray-700'}
              `}>
                           {day}
                       </button>
                   );
               })}
           </div>
       </div>
    );
};