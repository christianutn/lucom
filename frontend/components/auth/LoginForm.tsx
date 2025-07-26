
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import { User, Lock } from 'lucide-react';

const logoPath = 'logo.png';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 1 minute

const LoginForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  const auth = useContext(AuthContext);
  const { showNotification } = useNotification();

  useEffect(() => {
    let timer: number | undefined;
    if (isLoginDisabled && lockoutEndTime) {
      const remainingTime = lockoutEndTime - Date.now();
      if (remainingTime > 0) {
        timer = setTimeout(() => {
          setIsLoginDisabled(false);
          setLockoutEndTime(null);
          setLoginAttempts(0);
          showNotification("Puede intentar ingresar nuevamente.", "info");
        }, remainingTime) as unknown as number;
      } else {
        setIsLoginDisabled(false);
        setLockoutEndTime(null);
        setLoginAttempts(0);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoginDisabled, lockoutEndTime, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || isLoginDisabled) return;

    setIsLoading(true);
    try {
      const employeeIdForLogin: number | null = employeeId;
      await auth.login(employeeIdForLogin, password);
      setLoginAttempts(0);
    } catch (error: any) {
      const currentAttempts = loginAttempts + 1;
      setLoginAttempts(currentAttempts);

      if (error.status === 429 || currentAttempts >= MAX_LOGIN_ATTEMPTS) {
        showNotification("Ha superado el número máximo de intentos. Podrá reintentar en 1 minuto.", 'error');
        setIsLoginDisabled(true);
        setLockoutEndTime(Date.now() + LOCKOUT_DURATION_MS);
      } else if (error.status === 401) {
        showNotification(`ID de empleado o contraseña inválidos. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - currentAttempts}.`, 'error');
      } else {
        showNotification(error.message || 'Error de inicio de sesión. Por favor, intente de nuevo.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 shadow-xl rounded-xl">
      {isLoading && <Spinner />}
      <div className="flex justify-center">
        <img src={logoPath} alt="Logo Empresa" className="mb-8 h-16 w-auto" />
      </div>
      <h2 className="text-3xl font-bold text-center text-white">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            label="ID del Empleado"
            id="employeeId"
            type="number"
            value={employeeId === null ? '' : employeeId}
            onChange={(e) => setEmployeeId(e.target.value === '' ? null : Number(e.target.value))}
            placeholder="Ingrese su ID"
            required
            disabled={isLoginDisabled}
            icon={<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
          />
        </div>
        <div className="relative">
          <Input
            label="Contraseña"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            disabled={isLoginDisabled}
            icon={<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
          />
        </div>
        <Button type="submit" fullWidth disabled={isLoading || isLoginDisabled}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
