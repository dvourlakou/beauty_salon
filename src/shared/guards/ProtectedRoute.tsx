import {Navigate} from 'react-router';
import * as React from 'react';
import {useAuth} from '../../features/auth';
import LoadingSpinner from '../ui/LoadingSpinner';

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
        return <Navigate to = "/login" replace />;
    }

    //αν υπάρχουν roles όμως ο User δεν εχει κανένα απο αυτούς

    if (roles && roles.length >0 && !roles.includes(user.role)) {
        return <Navigate to = "/services" replace />;
    }

    return children;


};
