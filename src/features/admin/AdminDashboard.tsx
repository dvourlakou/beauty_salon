import {useState, useEffect} from 'react';
import {StatsCards} from './components/StatsCards.tsx';
import {WeeklyAppointments} from './components/WeeklyAppointments.tsx';
import {EmployeeWorkload} from './components/EmployeeWorkload.tsx';
import {DashboardStats, Appointment ,EmployeeWorkload as WorkloadType} from './types.ts';
import {LoadingSpinner} from '../../shared/ui/LoadingSpinner.tsx';

//mocking data for demo
const mockStats: DashboardStats = {
    total: 42,
    today:5,
    thisWeek:12,
    pending: 3,
};

const mockAppointments: Appointment[]= [
    {id:1, date:'2026-08-04', time:'10:30', serviceName: 'Μανικιούρ-Γαλλικό', employeeName: 'Αισθητικός 1', customerName:'Μαρία Κ.', status:'CONFIRMED'},
    {id:2, date:'2026-08-04', time:'12:00', serviceName: 'Αποτρίχωση-Μπικίνι', employeeName: 'Αισθητικός 3', customerName:'Ελένη Δ.', status:'PENDING'},
    {id:3, date:'2026-08-04', time:'14:00', serviceName: 'Μασάζ-full body 60λεπτα', employeeName: 'Αισθητικός 1', customerName:'Ιωάννα Π.', status:'CONFIRMED'},
];

const mockWorkload: WorkloadType[]= [
    {id: 1, name: 'Αισθητικός 1', total: 8, capacity: 10},
    {id: 2, name: 'Αισθητικός 2', total: 6, capacity: 10},
    {id: 3, name: 'Αισθητικός 3', total: 9, capacity: 10},
    {id: 4, name: 'Αισθητικός 4', total: 4, capacity: 10},
    {id: 5, name: 'Αισθητικός 5', total: 7, capacity: 10},
    {id: 6, name: 'Αισθητικός 6', total: 5, capacity: 10},
];

export const AdminDashboard = () =>{
    const {loading,setLoading} = useState(true);

    useEffect(() => {
        //simulate Api loading
        const timer = setTimeout(() => setLoading(false),500);
        return () => clearTimeout(timer);
    }, []);

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

            <StatsCards stats={mockStats} />

            <div className="mt-6">
                <WeeklyAppointments appointments={mockAppointments} />
            </div>

            <div className="mt-6">
                <EmployeeWorkload workload={mockWorkload} />
            </div>
        </div>
    );
};