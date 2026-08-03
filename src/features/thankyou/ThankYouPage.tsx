import { useNavigate } from 'react-router';

 export const ThankYouPage = () => {
     const navigate = useNavigate();

     return (
         <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">

             {/* κεντρικό μήνυμα */}
             <div className="text-center max-w-md">

                 {/* μήνυμα ρυχαριστίας */}
                 <h1 className="text-3xl md:text-4xl font-light text-gray-700 mb-4">
                     Σας ευχαριστούμε πολύ
                 </h1>

                 <h2 className="text-4xl md:text-5xl font-bold text-pink-300 tracking-wider mb-8">
                     Beauty Salon
                 </h2>

                 {/* διαχωριστική γραμμή */}
                 <div className="w-16 h-1 bg-pink-200 rounded-full mx-auto mb-8"></div>


                 {/* κουμπί επιστροφής */}
                 <button
                     onClick={() => navigate('/')}
                     className="px-8 py-3 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition-all duration-300 shadow-md hover:shadow-lg">
                     Επιστροφή στην Αρχική
                 </button>
             </div>
         </div>
     );
 };
