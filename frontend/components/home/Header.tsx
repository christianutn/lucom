import { useState, useContext } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

import UserProfileCard from '../common/UserProfileCard';

const Header = () => {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  const [isOpenProfileCardOpen, setIsOpenProfileCard] = useState(false);


  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center flex-grow justify-center">
        <h1 className="text-xl font-bold">LUCOM</h1>
      </div>
      <div className="flex items-center space-x-4">

        <button onClick={() => setIsOpenProfileCard(!isOpenProfileCardOpen)}>
          <User size={24} />
        </button>
        {
          isOpenProfileCardOpen && (
            <UserProfileCard user={user} onClose={() => setIsOpenProfileCard(false)} />
          )
        }

        <button onClick={() => {
          localStorage.removeItem('jwt');
          window.location.href = '/login';
        }}>
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;