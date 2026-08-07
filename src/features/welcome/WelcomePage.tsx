import { useNavigate } from 'react-router';

const WelcomePage =() => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 bg-white">
            <div className="flex-1 flex items-end">
                <h1 className="text-6xl md:text-8xl font-bold text-pink-300 tracking-wider">
                    Beauty Salon
                </h1>
            </div>

            <div className="flex-1 flex items-center">
                <h2 className="text-2xl md:text-4xl font-light text-blue-500 tracking-wide text-center">
                    Κέντρο Ομορφιάς και Χαλάρωσης
                </h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end space-y-4 w-full max-w-xs">
                <button
                    onClick={() => navigate('/register')}
                    className="w-full py-3 text-lg font-medium text-pink-400 border-2 border-pink-300 rounded-full hover:bg-pink-50 transition-all duration-300">
                    Εγγραφή
                </button>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 text-lg font-medium text-gray-500 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-300">
                    Σύνδεση
                </button>

                <p className="text-xs text-gray-400 mt-6">
                    {new Date().getFullYear()} Beauty Salon. All rights reserved.
                </p>
            </div>

        </div>
    );
};

export default WelcomePage;
