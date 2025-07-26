import React from 'react';
import { User } from '../../types';
import Card from './Card';

interface UserProfileCardProps {
  user: User | null;
  onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Card className="relative p-8 w-96 max-w-md mx-auto text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h3>
        <div className="space-y-2">
          <p><strong>ID Empleado:</strong> {user?.empleado_id}</p>
          <p><strong>Rol:</strong> {user?.rol}</p>
          <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
          <p><strong>Correo:</strong> {user?.correo_electronico}</p>
        </div>
      </Card>
    </div>
  );
};

export default UserProfileCard;
