import { Appointment } from  '../types.ts';

interface WeeklyAppointmentsProps {
    appointments: Appointment[];
}

export const WeeklyAppointments = ({ appointments }: WeeklyAppointmentsProps) => {
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string>= {
            PENDING: 'bg-yellow-100 text-yellow-700',
            CONFIRMED: 'bg-blue-100 text-blue-700',
            COMPLETED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
        };

        const labels: Record<string, string> = {
            PENDING: 'Εκκρεμές',
            CONFIRMED: 'Επιβεβαιωμένο',
            COMPLETED: 'Ολοκληρώθηκε',
            CANCELLED: 'Ακυρώθηκε'
        };

        return (
            <span> className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.PENDING}`}
                {labels[status] || status}
            </span>
        );
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Ραντεβού Εβδομάδας</h2>
            {appointments.length === 0 ? (
                <p className="text-gray-400 text-center py-6">Δεν υπάρχουν ραντεβού για αυτή την εβδομάδα</p> ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                               <tr className="text-b border-gray-100">
                                <th className="text-left py-2 font-medium text-gray-400">Ημερομηνία</th>
                                <th className="text-left py-2 font-medium text-gray-400">Ώρα</th>
                                <th className="text-left py-2 font-medium text-gray-400">Αισθητικός</th>
                                <th className="text-left py-2 font-medium text-gray-400">Κατάσταση</th>
                               </tr>
                            </thead>
                            <tbody>
                            {appointments.map((app) => (
                                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3">{app.date}</td>
                                    <td className="py-3">{app.time}</td>
                                    <td className="py-3">{app.serviceName}</td>
                                    <td className="py-3">{app.employeeName}</td>
                                    <td className="py-3">{getStatusBadge(app.status)}</td>
                                </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
            )}
        </div>
    );
};
