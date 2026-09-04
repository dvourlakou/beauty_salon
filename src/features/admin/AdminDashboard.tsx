import { useState, useEffect } from 'react';
import { StatsCards } from './components/StatsCards.tsx';
import { WeeklyAppointments } from './components/WeeklyAppointments.tsx';
import { EmployeeWorkload } from './components/EmployeeWorkload.tsx';
import type { DashboardStats, Appointment, EmployeeWorkload as WorkloadType } from './types';
import LoadingSpinner from '../../shared/ui/LoadingSpinner.tsx';
import { adminApi } from '../../api/adminApi.ts';

export const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [workload, setWorkload] = useState<WorkloadType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Φόρτωση όλων των δεδομένων του Dashboard
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, appointmentData, workloadData] = await Promise.all([
                adminApi.getStats(),
                adminApi.getWeeklyAppointments(),
                adminApi.getEmployeeWorkload()
            ]);

            setStats(statsData);
            setAppointments(appointmentData || []);
            setWorkload(workloadData || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Αποτυχία φόρτωσης δεδομένων του Dashboard. Παρακαλώ δοκιμάστε ξανά.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            await fetchDashboardData();
        };
        void loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button 
                    onClick={() => void fetchDashboardData()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Επανάληψη
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <span className="text-sm text-gray-400">
                    Τελευταία ενημέρωση: {new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Εμφάνιση Καρτών Στατιστικών */}
            {stats && <StatsCards stats={stats} />}

            {/* Εβδομαδιαίο Πρόγραμμα Ραντεβού */}
            <div className="mt-6">
                <WeeklyAppointments appointments={appointments} />
            </div>

            {/* Φόρτος Εργασίας Αισθητικών */}
            <div className="mt-6">
                <EmployeeWorkload workload={workload} />
            </div>
        </div>
    );
};

export default AdminDashboard;