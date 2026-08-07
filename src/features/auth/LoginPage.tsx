import {useState} from 'react';
import {useNavigate, Link} from 'react-router';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod';
import {useAuth} from './hooks/useAuth.tsx';
import toast from 'react-hot-toast';


const loginSchema = z.object({
    email: z.string().email('Παρακαλώ γράψτε το email σας'),
    password: z.string().min(6,'Ο κωδικός σας πρέπει να αποτελείται από τουλάχιστον 6 χαρακτήρες'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const {isLoading , setIsLoading} = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData> ({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            toast.success('Καλώς ήρθατε');
            navigate('/services');
        }
        catch {
            toast.error('Δώσατε λάθος email ή password');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className = "min-h-screen flex flex-col items-center justify-center px-4 bg-white">
            <h1 className = "text-4xl md:text-5xl font-bold text-pink-300 tracking-wider mb-12">
                Beauty Salon
            </h1>

            <form onSubmit = {handleSubmit(onSubmit)} className = "w-full max-w-sm space-y-4">
                <div>
                    <input
                        type = 'email'
                        placeholder = 'Email'
                        {...register('email')}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors 
                                     ${errors.email ? 'border-red-400' : 'border-gray-200'}
                                     `}
                        />
                    {errors.email && (
                        <p className = "text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type = 'submit'
                    disabled = {isLoading}
                    className = 'w-full py-3 text-lg font-medium text-white bg-pink-300 rounded-lg hover:bg-pink-400 transition-all duration-300 disabled:opacity-50'
                    >

                    {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
                </button>

                <p className = "text-center text-gray-400 mt-4">
                    Δεν έχετε λογαριασμό; {' '}
                    <Link to = "/register" className = "text-pink-300 hover:underline font-medium">
                        Εγγραφή
                    </Link>
                </p>


            </form>
        </div>
    );
};

export default LoginPage;