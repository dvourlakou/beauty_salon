/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext , useContext } from 'react';
import * as React from 'react';
import {authApi} from '../../../api/authApi';
import  type { User, AuthContextType, RegisterData} from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ( { children }: { children: React.ReactNode } ) => {
    const [user,setUser] = useState<User |null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(()  => {
        const loadUser = async () => {

            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await authApi.getMe();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to load user session:',error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        void loadUser();
    }, []);

    const login = async (email: string,password: string) => {
        const response = await authApi.login(email, password);
        localStorage.setItem('token', response.token);
        setUser(response.user);
    };


    const register = async (data: RegisterData) => {
        await  authApi.register(data);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

