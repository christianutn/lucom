
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/auth.js';
import { AuthContextType, User } from '../types.js';
import { useNotification } from '../hooks/useNotification.js';
import {getMiUsuario} from '../services/usuarios.js';



export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('jwt'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        if (token) {
            localStorage.setItem('jwt', token);
            setIsAuthenticated(true);
            const fetchUser = async () => {
                try {
                    const userData = await getMiUsuario();
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Optionally, log out the user if fetching user data fails
                    logout();
                }
            };
            fetchUser();
        } else {
            localStorage.removeItem('jwt');
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]);

    const login = useCallback(async (employeeId: number | null, password_raw: string) => {
        try {
            const response = await apiLogin({empleado_id: employeeId, contrasena: password_raw});
            setToken(response.token);
            showNotification('¡Ingreso exitoso!', 'success');
            navigate('/sales');
        } catch (error: any) {
            setToken(null); // Clear token on failed login
            throw error; // Re-throw for LoginForm to handle specific messages
        }
    }, [navigate, showNotification]);

    const logout = useCallback(() => {
        setToken(null);
        navigate('/login');
        showNotification('Sesión cerrada.', 'info');
    }, [navigate, showNotification]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};