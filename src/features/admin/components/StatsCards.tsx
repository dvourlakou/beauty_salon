import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
    stats: DashboardStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const cards = [
        {label: 'Σύνολο Ραντεβού', value: stats.total, icon: Calendar, color: 'text-blue-500', bg:'bg-blue-50'},
        {label: 'Ραντεβού Σήμερα', value: stats.today, icon: Clock, color: 'text-green-500', bg:'bg-green-50'},
        {label: 'Τρέχουσα Εβδομάδα', value: stats.thisWeek, icon: Calendar, color: 'text-purple-500', bg:'bg-purple-50'},
        {label: 'Εκκρεμή', value: stats.pending, icon: Users, color: 'text-orange-500', bg:'bg-orange-50'},
    ];

    return (
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{cards.map((card) => (
           <div key={card.label} className="bg-white rounded-xl shadow-sm dorder border-gray-100 p-4">
               <div className="flex items-center gap-3">
                   <div className={`${card.bg} rounded-lg p-2`}>
                       <card.icon size={20} className={card.color} />
                   </div>
                   <div>
                       <p className="text-sm text-gray-400">{card.label}</p>
                       <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                   </div>
               </div>
           </div>
       ))}
       </div>
    );
};
