import {useState, useEffect} from 'react';
import {StatsCards} from './components/StatsCards.tsx';
import {WeeklyAppointments} from './components/WeeklyAppointments.tsx';
import {EmployeeWorkload} from './components/EmployeeWorkload.tsx';
import type {DashboardStats, Appointment ,EmployeeWorkload as WorkloadType} from './types';
import LoadingSpinner from '../../shared/ui/LoadingSpinner.tsx';
import {adminApi} from '../../api/adminApi.ts';


export const AdminDashboard = () =>{
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [workload, setWorkload] = useState<WorkloadType[]>([]);
    const [loading,setLoading] = useState(true);

    //Φόρτωση όλων των δεδομένων του Dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, appointmentData, workloadData] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getWeeklyAppointments(),
                    adminApi.getEmployeeWorkload()
                ]);
                setStats(statsData);
                setAppointments(appointmentData);
                setWorkload(workloadData);
            }
            catch (error) {
                console.error('Failed to fetch dashboard data:',error);
            }
            finally {
                setLoading(false);
            }
        };
        void fetchDashboardData();
    },[]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <span className="text-sm text-gray-400">Τελευταία ενημέρωση: {new Date().toLocaleTimeString('el')}</span>
            </div>

            {/* ελέγχω αν το stats υπαρχει */}
            {stats && <StatsCards stats={stats} />}

            <div className="mt-6">
                <WeeklyAppointments appointments={appointments} />
            </div>

            <div className="mt-6">
                <EmployeeWorkload workload={workload} />
            </div>
        </div>
    );
};