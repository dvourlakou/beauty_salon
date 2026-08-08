import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, Scissors, Users, LogOut } from 'lucide-react';
import { useAuth } from "../auth";
import { useNavigate } from "react-router";

export const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const navItems =[
        { to: '/admin', icon: LayoutDashboard, label: "Dashboard"},
        { to: '/admin/services', icon: Scissors, label: "Υπηρεσίες"},
        { to: '/admin/employees', icon: Users, label: "Αισθητικοί"},
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 p-4 flex flex-col">
                <h1 className="text-xl font-bold text-pink-300 mb-8">Admin Panel</h1>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-400': 'text-gray-600 hover:bg-gray-50'}`}>
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                        ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py -3 text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut size={20} /> Αποσύνδεση
                </button>
            </aside>

            {/* main content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};
