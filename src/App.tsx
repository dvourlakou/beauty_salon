
import {createBrowserRouter, RouterProvider} from 'react-router';
import {Toaster} from "react-hot-toast";
import {AuthProvider} from './features/auth/hooks/useAuth.tsx';
import {ProtectedRoute} from './shared/guards/ProtectedRoute';
import {WelcomePage} from './features/welcome';
import {LoginPage} from './features/auth';
import {RegisterPage} from './features/auth';
import {ServicesPage} from './features/services';
import {BookingPage} from './features/booking';
import {ConfirmPage} from './features/booking';
import {ThankYouPage} from './features/thankyou';
import {AdminDashboard, AdminServices, AdminEmployee, AdminLayout} from './features/admin';



const router = createBrowserRouter([

    //public routes

    {path: '/', element: <WelcomePage />,},
    {path: '/login', element: <LoginPage />,},
    {path: '/register', element: <RegisterPage />,},
    {path: '/services', element: <ServicesPage />,},
    {path: '/thankyou', element: <ThankYouPage />,},

    //protect routes from users log in

    {
        path: '/booking', element: (<ProtectedRoute> <BookingPage /> </ProtectedRoute>),
    },

    {
        path: '/confirm', element: (<ProtectedRoute> <ConfirmPage /> </ProtectedRoute>)
    },

    //admin routes only for role of admin

    {
        path: '/admin', element: (<ProtectedRoute roles={ ['ADMIN']}> <AdminLayout /> </ProtectedRoute>),

        children:[
            {index : true, element: <AdminDashboard />},
            {path: '/services', element: <AdminServices />},
            {path:'/employee', element: <AdminEmployee />}

        ]
    }
]);

function App(){
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster position= "top-right" />
        </AuthProvider>
    );
}
export default  App;






