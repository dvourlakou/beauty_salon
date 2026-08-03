import { useNavigate, useLocation } from 'react-router';
import { CheckCircle , Calendar, Clock, User, DollarSign ,Mail} from "lucide-react";
import {Button} from '../shared/ui/Button';

interface ConfirmationPage {
    serviceName: string;
    date: string;
    time: string;
    employeeName?: string;
    price: number;
    email: string;
}

export const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state as ConfirmationData;

    //αν δεν υφίστανται data, redirect στις υπηρεσίες
    if (!data) {
        navigate('/services');
        return null;
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('el', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">

                {/* success icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                        <CheckCircle size={48} className="text-green-500"/>
                    </div>
                </div>

                {/* title */}
                <h1 className="text-2xl font-bold text-gary-800 mb-2">
                    Κλείστηκε Ραντεβού
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Το ραντεβού σας επιβεβαιώθηκε με επιτυχία
                </p>

                {/* confirmation details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
                    <div className="flex-itmes-center gap-3">
                        <Calendar size={18} className="text-pink-400"/>
                        <span className="text-gray-700">
                            <strong>Ημερομηνία:</strong> {formatDate(data.date)}
                        </span>
                    </div>

                    <div className="flex-itmes-center gap-3">
                        <Clock size={18} className="text-pink-400"/>
                        <span className="text-gray-700">
                            <strong>Ώρα:</strong> {data.time}
                        </span>
                    </div>

                    <div className="flex-itmes-center gap-3">
                        <User size={18} className="text-pink-400"/>
                        <span className="text-gray-700">
                            <strong>Υπηρεσία:</strong> {data.serviceName}
                        </span>
                    </div>

                    {data.employeeName && (
                        <div className="flex-itmes-center gap-3">
                            <User size={18} className="text-pink-400"/>
                            <span className="text-gray-700">
                               <strong>Αισθητικός:</strong> {data.employeeName}
                            </span>
                        </div>
                    )
                    }

                    <div className="flex-itmes-center gap-3">
                        <DollarSign size={18} className="text-pink-400"/>
                        <span className="text-gray-700">
                            <strong>Τιμή:</strong> {data.price}€
                        </span>
                    </div>

                    {/* email confirm */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
                        <Mail size={16}/>
                        <span>Στάλθηκε επιβεβαίωση στο <strong>{data.email}</strong></span>
                    </div>

                    {/* action buttons */}
                    <div className="space-y-3">
                        <Button
                            label="Επιστροφή πίσω στις υπηρεσίες"
                            onClick={() => navigate('/services')}
                            addClasses="w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl"/>
                        <button
                            onClick={() => navigate('/thank-you')}
                            className="text-sm text-pink-400 hover:underline">
                            Ευχαριστούμε
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
