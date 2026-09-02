import {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from "react-router";
import {Calendar} from './components/Calendar';
import { TimeSlots} from "./components/ΤimeSlots.tsx";
import {SelectEmployee} from "./components/SelectEmployee.tsx";
import {BookingSummary} from "./components/BookingSummary.tsx";
import type{ Service , Employee ,BookingDetails } from './types.ts';
import LoadingSpinner  from "../../shared/ui/LoadingSpinner.tsx";
import toast from 'react-hot-toast';
import {serviceApi} from "../../api/serviceApi.ts";
import {appointmentApi} from "../../api/appointmentApi.ts";
import {useAuth} from "../auth";

const  formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() +1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const BookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {user} = useAuth();
    const serviceId = parseInt(searchParams.get('service') || '0');

    const [service,setService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date |null>(null);
    const [selectedTime, setSelectedTime] = useState<string |null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<number |null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading,setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    //Φόρτωση υπηρεσίας από το API
    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await serviceApi.getServiceById(serviceId);
                setService(data);
            }
            catch  {
                toast.error('Η υπηρεσία δε βρέθηκε');
                navigate('/services');
            }
            finally {
                setLoading(false);
            }
        };
        void fetchService();
    }, [serviceId,navigate]);

    //Φόρτωση εργαζομένων από το API
    useEffect(() => {
        if (service) {
            const fetchEmployees = async () => {
                try {
                    const data = await appointmentApi.getEmployeeByService(service.id);
                    setEmployees(data);
                } catch (error) {
                    console.error('Failed to load employees:', error);
                }
            };
            void fetchEmployees();
        }
    }, [service]);

    //Φόρτωση διαθέσιμων ωρών από το API
    useEffect(() => {
        if (selectedDate && service) {
            const fetchSlots = async () => {
                try {
                    const dateStr = formatDateToLocalString(selectedDate);
                    const slots = await appointmentApi.getAvailableSlots(
                        service.id,
                        dateStr,
                        selectedEmployee || undefined
                    );
                    setAvailableSlots(slots);
                }
                catch (error) {
                    console.error('Failed to load slots:', error);
                }
            };
            void fetchSlots();
        }
    },[selectedDate, service, selectedEmployee]);

    //Δημιουργία ραντεβού
    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !service) {
            toast.error('Παρακαλώ επιλέξτε την ημερομηνία και ώρα ου σας εξυπηρετεί');
            return;
        }

        setSubmitting(true);

        try {
            const formattedDate = formatDateToLocalString(selectedDate);
            const bookingData: BookingDetails = {
                serviceId: service.id,
                date: formattedDate,
                time: selectedTime,
                employeeId: selectedEmployee || undefined,
            };

            //Αποστολή αιτήματος στο Api
            await appointmentApi.createBooking(bookingData);

            toast.success('Η κράτηση ολοκληρώθηκε με επιτυχία');


            //πλοήγηση στη σελίδα επιβεβαίωσης κράτησης με το email του χρήστη
            navigate('/confirmation' , {
                state: {
                    serviceName: service.name,
                    date: bookingData.date,
                    time: bookingData.time,
                    employeeName: employees.find(e => e.id === selectedEmployee)?.name,
                    price: service.price,
                    email: user?.email || 'Δε δηλώθηκε email',
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
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setSelectedTime(null);
                        }}
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
                            onSelectEmployee={(empId) => {
                                setSelectedEmployee(empId);
                                setSelectedTime(null);
                            }}
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
                    className="w-full py-3 text-lg font-semibold text-white bg-pink-300 rounded-xl hover:bg-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                    {submitting ? 'Κλείσιμο ραντεβού...' : 'Κλείστε ραντεβού'}
                </button>

            </div>
        </div>


    );
};
