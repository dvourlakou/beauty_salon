import {Navigate} from 'react-router';
import * as React from 'react';
import {useAuth} from '../../features/auth';
import LoadingSpinner from '../ui/LoadingSpinner';



interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    role?: string[];

}

export const ProtectedRoute = ({ children, allowedRoles, role}: ProtectedRouteProps) => {
    const { user, isLoading} = useAuth();


    const restMatch = allowedRoles || role;

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

    if (restMatch && restMatch.length >0) {
        const isAllowed  =  restMatch.includes(user.role);



        if (!isAllowed) {
            console.warn(`Access denied. User role: ${user.role}, Allowed: ${restMatch.join(',')}`);
            return <Navigate to="/services" replace/>;
        }
    }

    return <> {children} </>;


};
