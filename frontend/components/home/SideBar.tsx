import { NavLink } from 'react-router-dom';
import { Home, FileText, Users, TicketPercent , FilePenLine , Menu, X, HousePlus, User } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <>
      {/* Overlay for when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40 w-64 bg-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <h2 className="text-2xl font-bold text-white">Menú</h2>
          </div>
          <nav className="flex-1 px-2 py-4">
            <NavLink to="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
              <Home size={20} className="mr-3" />
              Inicial
            </NavLink>
            <NavLink to="/sales" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
              <FileText size={20} className="mr-3" />
              Formulario de Venta
            </NavLink>
            {user && user.rol === "ADM" && (
              <>
                <NavLink to="/usuarios" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
                  <Users size={20} className="mr-3" />
                  Usuarios
                </NavLink>
                <NavLink to="/origenes-datos" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
                  <FilePenLine   size={20} className="mr-3" />
                  Origenes de Datos
                </NavLink>
                <NavLink to="/abonos" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
                  <TicketPercent  size={20} className="mr-3" />
                  Abonos
                </NavLink>
                <NavLink to="/tipos-domicilios" className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={toggleSidebar}>
                  <HousePlus size={20} className="mr-3" />
                  Tipos de Domicilios
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;