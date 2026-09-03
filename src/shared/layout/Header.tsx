import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../features/auth';
import {LogOut, User } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className = "bg-cf-dark-gray fixed w-full top-0 left-0 z-50">
            <div className = "container mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo */}
                <Link  to = "/" className = "text-pink-300 text-xl font-bold tracking-wider">
                    Beauty Salon
                </Link>

                {/* Navigation */}
                <nav className = "flex items-center gap-6">
                    <Link to = "/services" className = "text-white hover:text-pink-300 transition-colors">
                        Υπηρεσίες
                    </Link>


                {user && (
                    <>
                    {user.role !=='ADMIN' && (
                        <Link to = "/my-bookings" className = "text-white hover:text-pink-300 transition-colors">
                           Τα ραντεβού μου
                        </Link>
                    )}
                    {user.role === 'ADMIN' && (
                        <Link to="/admin" className="text-white hover:text-pink-300 transition-colors">
                           Admin Dashboard
                        </Link>
                    )}
                    </>

                )}

                {user ? (
                    <button
                        onClick = {handleLogout}
                        className = "flex items-center gap-2 text-white hover:text-pink-300 transition-colors">

                        <LogOut size = {18}/>
                        Αποσύνδεση
                    </button>
                ) : (
                    <Link to = "/login" className = "text-white hover:text-pink-300 transition-colors">
                        <User size = {18} />
                        <span> Σύνδεση </span>
                    </Link>

                )}
            </nav>
            </div>
        </header>
    );


};

export default Header;