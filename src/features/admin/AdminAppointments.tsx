import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Trash2, Filter, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

export interface Appointment {
    id: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    serviceName: string;
    employeeName: string;
    appointmentDate: string;
    appointmentTime?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export const AdminAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // Φόρτωση ραντεβού
    const fetchAppointments = async () => {
        try {
            const data = await adminApi.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            toast.error((error as Error).message || 'Αποτυχία φόρτωσης ραντεβού');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchAppointments();
    }, []);

    // Αλλαγή κατάστασης ραντεβού
    const handleStatusChange = async (id: number, newStatus: Appointment['status']) => {
        try {
            await adminApi.updateAppointmentStatus(id, newStatus);
            toast.success(`Το ραντεβού ενημερώθηκε σε ${newStatus}`);
            void fetchAppointments();
        } catch (error) {
            toast.error((error as Error).message || 'Αποτυχία ενημέρωσης status');
        }
    };

    // Διαγραφή ραντεβού
    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουρος/η για τη διαγραφή αυτού του ραντεβού;')) return;
        try {
            await adminApi.deleteAppointment(id);
            toast.success('Το ραντεβού διαγράφηκε επιτυχώς');
            void fetchAppointments();
        } catch (error) {
            toast.error((error as Error).message || 'Αποτυχία διαγραφής');
        }
    };

    // Φιλτράρισμα ραντεβού
    const filteredAppointments = appointments.filter((app) => {
        if (statusFilter === 'ALL') return true;
        return app.status === statusFilter;
    });

    const getStatusBadge = (status: Appointment['status']) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">Εκκρεμεί</span>;
            case 'CONFIRMED':
                return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Επιβεβαιωμένο</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Ακυρωμένο</span>;
            case 'COMPLETED':
                return <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">Ολοκληρώθηκε</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-300" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Διαχείριση Ραντεβού</h1>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Κατάσταση:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm font-medium text-gray-700 focus:outline-none bg-transparent cursor-pointer"
                    >
                        <option value="ALL">Όλα</option>
                        <option value="PENDING">Εκκρεμή</option>
                        <option value="CONFIRMED">Επιβεβαιωμένα</option>
                        <option value="COMPLETED">Ολοκληρωμένα</option>
                        <option value="CANCELLED">Ακυρωμένα</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Δε βρέθηκαν ραντεβού
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-100">
                                    <th className="py-3 px-4 font-semibold">Πελάτης</th>
                                    <th className="py-3 px-4 font-semibold">Υπηρεσία</th>
                                    <th className="py-3 px-4 font-semibold">Αισθητικός</th>
                                    <th className="py-3 px-4 font-semibold">Ημερομηνία & Ώρα</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Ενέργειες</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredAppointments.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Πελάτης */}
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-gray-800 flex items-center gap-1">
                                                <User size={14} className="text-gray-400" />
                                                {app.clientName}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Phone size={12} className="text-gray-400" />
                                                {app.clientPhone}
                                            </div>
                                        </td>

                                        {/* Υπηρεσία */}
                                        <td className="py-3 px-4 font-medium text-gray-700">
                                            {app.serviceName}
                                        </td>

                                        {/* Αισθητικός */}
                                        <td className="py-3 px-4 text-gray-600">
                                            {app.employeeName || 'Όποιος είναι διαθέσιμος'}
                                        </td>

                                        {/* Ημερομηνία & Ώρα */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Calendar size={14} className="text-pink-400" />
                                                <span>{app.appointmentDate}</span>
                                            </div>
                                            {app.appointmentTime && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span>{app.appointmentTime}</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            {getStatusBadge(app.status)}
                                        </td>

                                        {/* Ενέργειες */}
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {app.status !== 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'CONFIRMED')}
                                                        title="Σήμανση ως Επιβεβαιωμένο"
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {app.status !== 'COMPLETED' && (
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'COMPLETED')}
                                                        title="Σήμανση ως Ολοκληρωμένο"
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {app.status !== 'PENDING' && (
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'PENDING')}
                                                        title="Επαναφορά σε Εκκρεμότητα"
                                                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <AlertCircle size={18} />
                                                    </button>
                                                )}
                                                {app.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'CANCELLED')}
                                                        title="Ακύρωση ραντεβού"
                                                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(app.id)}
                                                    title="Διαγραφή ραντεβού"
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};