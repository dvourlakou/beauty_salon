
import {createBrowserRouter, RouterProvider} from 'react-router';
import {Toaster} from "react-hot-toast";
import {AuthProvider} from './features/auth';
import {ProtectedRoute} from './shared/guards/ProtectedRoute';
import {WelcomePage} from './features/welcome';
import {LoginPage} from './features/auth';
import {RegisterPage} from './features/auth';
import {ServicesPage} from './features/services';
import {BookingPage} from './features/booking';
import {ConfirmationPage} from './features/booking';
import {ThankYouPage} from './features/thankyou';
import {AdminDashboard, AdminServices, AdminEmployees, AdminLayout} from './features/admin';



const router = createBrowserRouter([

    //Δημόσιες διαδρομές όπου δεν απαιτείται σύνδεση

    {path: '/', element: <WelcomePage />,},
    {path: '/login', element: <LoginPage />,},
    {path: '/register', element: <RegisterPage />,},
    {path: '/services', element: <ServicesPage />,},
    {path: '/thankyou', element: <ThankYouPage />,},

    //Προστατευμένες διαδρομές όπου απαιτείται σύνδεση

    {
        path: '/booking', element: (<ProtectedRoute> <BookingPage /> </ProtectedRoute>),
    },

    {
        path: '/confirmation', element: (<ProtectedRoute> <ConfirmationPage /> </ProtectedRoute>)
    },

    //Διαδρομές μόνο γιατο χρήστη admin

    {
        path: '/admin', element: (<ProtectedRoute roles={ ['ADMIN']}> <AdminLayout /> </ProtectedRoute>),

        children:[
            {index : true, element: <AdminDashboard />},
            {path: '/services', element: <AdminServices />},
            {path:'/employee', element: <AdminEmployees />}

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






