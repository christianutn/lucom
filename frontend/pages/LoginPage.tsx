
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg px-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;