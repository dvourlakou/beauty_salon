import {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from "react-router";
import {Calendar} from './components/Calendar';
import { TimeSlots} from "./components/ΤimeSlots.tsx";
import {SelectEmployee} from "./components/SelectEmployee.tsx";
import {BookingSummary} from "./components/BookingSummary.tsx";
import  {serviceApi} from '../../api/serviceApi';
import type {appointmentApi} from "../../api/appointmentApi.ts";
import type{ Service , Employee ,BookingDetails } from './types.ts';
import LoadingSpinner  from "../../shared/ui/LoadingSpinner.tsx";
import toast from 'react-hot-toast';
import {ServiceCard} from "../services/components/ServiceCard.tsx";

export const BookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const serviceId = parseInt(searchParams.get('service') || '0');

    const [service,setService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date |null>(null);
    const [selectedTime, setSelectedTime] = useState<string |null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<number |null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading,setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    //Loading service details
    useEffect(() => {
        const fetchService = async () => {
            try {
                //χρησιμοποιώ mock data για δοκιμή
                const { mockCategories } = await import('../services/mockData.ts');
                const allServices = mockCategories.flatMap(cat => cat.services || []);
                const found = allServices.find(s => s.id === serviceId);
                if (found) {
                    setService(found);
                }
                else {
                    toast.error('Η υπηρεσία δε βρέθηκε');
                    navigate('/services');
                }
            }
            catch {
                toast.error('Η υπηρεσία δε βρέθηκε');
                navigate('/services');
            }
            finally {
                setLoading(false);
            }
        };
        void fetchService();
    }, [serviceId,navigate]);

    //Loading employees for each service
    useEffect(() => {
        if (service) {
            //χρησιμοποιώ mock employees για δοκιμή
            const mockEmployees: Employee[] = [
                { id:1, name: 'Αισθητικός 1', specialization: 'NAIL' },
                { id:2, name: 'Αισθητικός 2', specialization: 'NAIL' },
                { id:3, name: 'Αισθητικός 3', specialization: 'WAXING' },
                { id:4, name: 'Αισθητικός 4', specialization: 'WAXING' },
                { id:5, name: 'Αισθητικός 5', specialization: 'MASSAGE' },
                { id:6, name: 'Αισθητικός 6', specialization: 'MASSAGE' },
            ];

            //φίλτρο ανά κατηγορία
            const categoryMap: Record<number, string> = {
                1: 'NAIL',
                2: 'WAXING',
                3: 'MASSAGE',
            };
            const spec = categoryMap[service.categoryId] || 'NAIL';
            const filtered = mockEmployees.filter(emp => emp.specialization === spec);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEmployees(filtered);
        }
    }, [service]);

    //Loading available slots when the user changes date
    useEffect(() => {
        if (selectedDate && service) {
            //χρησιμοποιώ mock slots διαθέσιμες ώρες για δοκιμή
            const mockSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                '13:00','13:30','14:00','14:30','15:00', '15:30','16:00',
                '16:30','17:00', '17:30', '18:00', '18:30','19:00','19:30'];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAvailableSlots(mockSlots);
        }
    },[selectedDate, service]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !service) {
            toast.error('Παρακαλώ επιλέξτε την ημερομηνία και ώρα ου σας εξυπηρετεί');
            return;
        }

        setSubmitting(true);

        try {
            const bookingData: BookingDetails = {
                serviceId: service.id,
                date: selectedDate.toISOString().split('T')[0],
                time: selectedTime,
                employeeId: selectedEmployee || undefined,
            };

            console.log('Booking data:', bookingData);

            //πλοήγηση στη σελίδα επιβεβαίωσης κράτησης
            navigate('/confirmation' , {
                state: {
                    serviceName: service.name,
                    date: bookingData.date,
                    time: bookingData.time,
                    employeeNme: employees.find(e => e.id === selectedEmployee)?.name,
                    price: service.price,
                    email: 'user@example.com',
                }
            });


        }
        catch {
            toast.error('Μη επιτυχής κράτηση. Παρακαλώ δοκιμάστε ξανά.');
        }
        finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Η υπηρεσία δεν είναι διαθέσιμη</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-2xl mx-auto">

                {/* page header */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-pink-400 transition-colors">
                        Πίσω
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Κράτηση Ραντεβού</h1>
                  </div>

                {/* calendar */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Επιλέξτε Ημερομηνία</h2>
                    <Calendar
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        />

                   </div>

                {/* time slots */}
                {selectedDate && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Διαθέσιμες Ώρες</h2>
                    <TimeSlots
                            slots={availableSlots}
                            selectedTime={selectedTime}
                            onSelectedTime={setSelectedTime}
                    />
                  </div>
                )}

                {/* choose employee */}
                {employees.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Επιλογή Αισθητικού</h2>
                        <SelectEmployee
                            employees={employees}
                            selectedEmployee={selectedEmployee}
                            onSelectEmployee={setSelectedEmployee}
                        />
                    </div>
                )}

                {/* booking summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <BookingSummary
                        service={service}
                        date={selectedDate}
                        time={selectedTime}
                        employee={employees.find(e => e.id === selectedEmployee)}
                        />
                </div>

                {/* submit button */}
                <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || submitting}
                    className="w -full text-lg font-semibold text-white bg-pink-300 rounded-xl hover:bg-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                    {submitting ? 'Κλείσιμο ραντεβού...' : 'Κλείστε ραντεβού'}
                </button>

            </div>
        </div>


    );
};
