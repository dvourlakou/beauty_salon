import {Navigate} from 'react-router';
import {useAuth} from '../../features/auth/hooks/useAuth.tsx';
import {LoadingSpinner} from '../UI/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];

}

export const ProtectedRoute = ({ children, roles}: ProtectedRouteProps) => {
    const { user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner/>
            </div>
        );
    }

    if (!user){
        return <Navigate to = "/services" replace />
    }

    return children;


};
