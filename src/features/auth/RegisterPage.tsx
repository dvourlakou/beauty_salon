import {useState} from 'react';
import {useNavigate ,Link } from 'react-router';
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod';
import {useAuth} from './hooks/useAuth';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';

const registerSchema = z.object ({
    email: z.email( " Παρακαλώ καταχωρήστε το email σας"),
    name: z.string().min(2 , "Το όνομα σας πρέπει να αποτελείται από τουλάχιστον 2 χαρακτήρες"),
    phone: z
    .string()
    .min(10, 'Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία')
    .regex(/^[0-9]+$/, 'Επιτρέπονται μόνο ψηφία'),
    password: z.string().min(6 , "Ο κωδικός σας πρέπει να αποτελείται από τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Οι κωδικοί δεν ταυτίζονται",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register:registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData> ({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data:RegisterFormData) => {
        setIsLoading(true);
        try {
            await  registerUser({
                email:data.email,
                phone: data.phone,
                name: data.name,
                password: data.password,
            });
            toast.success('Η εγγραφή σας ολοκληρώθηκε με επιτυχία, μπορείτε να συνδεθείτε');
            navigate('/login');
        }
        catch (error: unknown){
            const message = (error as AxiosError<{message: string}>).response?.data?.message || 'Το email σας χρησιμοποιείται ήδη';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-300 tracking-wider mb-10">
                Beauty Salon
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Όνομα"
                        {...register('name')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200'}`}/>

                    {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}

                </div>


                <div>
                    <input
                        type="tel"
                        placeholder="Τηλέφωνο"
                        {...register('phone')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}/>

                    {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                    )}

                </div>



                <div>
                    <input
                        type="password"
                        placeholder="Κωδικός"
                        {...register('password')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Επιβεβαίωση κωδικού"
                        {...register('confirmPassword')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-lg font-medium text-white bg-pink-300 rounded-lg hover:bg-pink-400 transition-all duration-300 disabled:opacity-50">
                    {isLoading ? 'Εγγραφή...' : 'Εγγραφή'}
                </button>

                <p className="text-center text-gray-400 mt-4">
                    Έχετε ήδη λογαριασμό?{' '}
                    <Link to="/login" className="text-pink-300 hover:underline font-medium">
                        Σύνδεση
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;

