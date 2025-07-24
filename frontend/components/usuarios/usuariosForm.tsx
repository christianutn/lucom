import { useState, useEffect, FormEvent } from 'react';
import { getUsuarios, putUsuarios, postUsuario } from '../../services/usuarios';
import { IUsuario, IRol, IUsuarioUpdate, IUsuarioCreate } from '../../types';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import { validarEmail } from "../../utils/validarDatosEntrada";
import { formatName } from '../../utils/formatear';
import Input from '../common/Input';
import { getRoles } from '../../services/roles';

const emptyUsuario: IUsuario = {
    empleado_id: 0,
    rol: '',
    contrasena: '',
    activo: 1,
    empleado: {
        id: 0,
        nombre: '',
        apellido: '',
        correo_electronico: '',
        activo: 1,
    },
    nuevaContrasena: '',
    isNuevaContrasena: 0,
};

const UsuariosForm = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [roles, setRoles] = useState<IRol[]>([]);
    const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<IUsuario>(emptyUsuario);
    const { showNotification } = useNotification();

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroId, setFiltroId] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [usuariosRes, rolesRes] = await Promise.all([
                    getUsuarios(),
                    getRoles()
                ]);
                setUsuarios(usuariosRes);
                setRoles(rolesRes);
            } catch (error) {
                console.error("Error fetching data:", error);
                // showNotification('Error al cargar datos iniciales', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedUsuario) {
            setFormData(selectedUsuario);
        } else {
            setFormData(emptyUsuario);
        }
    }, [selectedUsuario]);

    const handleCreateClick = () => {
        setSelectedUsuario(null);
        setIsCreating(true);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleEditClick = (usuario: IUsuario) => {
        setSelectedUsuario({ ...usuario, isNuevaContrasena: 0, nuevaContrasena: '' });
        setIsCreating(false);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setSelectedUsuario(null);
        setErrorNombre('');
        setErrorApellido('');
        setErrorCorreo('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const inputValue = isCheckbox ? ((e.target as HTMLInputElement).checked ? 1 : 0) : value;

        if (isCheckbox && name === 'isNuevaContrasena' && inputValue === 0) {
            setFormData(prev => ({ ...prev, nuevaContrasena: "" }));
        }
        setFormData(prev => ({ ...prev, [name]: inputValue }));
    };

    const handleEmpleadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let valueToSet = value;

        switch (name) {
            case 'nombre':
                valueToSet = formatName(value);
                setErrorNombre(value.trim() === '' ? 'El nombre es obligatorio' : '');
                break;
            case 'apellido':
                valueToSet = formatName(value);
                setErrorApellido(value.trim() === '' ? 'El apellido es obligatorio' : '');
                break;
            case 'correo_electronico':
                valueToSet = value.trim().toLowerCase();
                setErrorCorreo(validarEmail(value) ? '' : 'El correo electrónico es inválido');
                break;
        }

        setFormData(prev => ({ ...prev, empleado: { ...prev.empleado, [name]: valueToSet } }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (errorNombre || errorApellido || errorCorreo) {
            showNotification('Por favor, corrige los errores antes de guardar', 'error');
            return;
        }
        if (!formData.rol) {
            showNotification('Por favor, selecciona un rol', 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (isCreating) {
                const usuarioCreate: IUsuarioCreate = {
                    rol: formData.rol,
                    contrasena: formData.contrasena,
                    activo: formData.activo,
                    nombre: formData.empleado.nombre,
                    apellido: formData.empleado.apellido,
                    correo_electronico: formData.empleado.correo_electronico,
                };
                await postUsuario(usuarioCreate);
                showNotification('Usuario creado correctamente', 'success');
            } else {
                const usuarioUpdate: IUsuarioUpdate = {
                    empleado_id: formData.empleado_id,
                    rol: formData.rol,
                    activo: formData.activo,
                    nombre: formData.empleado.nombre,
                    apellido: formData.empleado.apellido,
                    correo_electronico: formData.empleado.correo_electronico,
                    isNuevaContrasena: formData.isNuevaContrasena,
                    nuevaContrasena: formData.nuevaContrasena || '',
                };
                await putUsuarios(usuarioUpdate);
                showNotification('Usuario actualizado correctamente', 'success');
            }

            const updatedUsuarios = await getUsuarios();
            setUsuarios(updatedUsuarios);
            setIsFormVisible(false);
            setSelectedUsuario(null);
            setFormData(emptyUsuario);
        } catch (error) {
            showNotification('Error: Revisar datos de entrada del formulario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        const nombreCompleto = `${usuario.empleado.nombre} ${usuario.empleado.apellido}`.toLowerCase();
        const idString = usuario.empleado_id.toString();

        const matchNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
        const matchId = idString.includes(filtroId);

        return matchNombre && matchId;
    });


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 text-gray-300 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Gestión de Usuarios</h1>

                {isLoading && <Spinner />}

                {isFormVisible ? (
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">{isCreating ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna 1 */}
                            <div className="space-y-4">
                                {!isCreating && (
                                    <Input label="ID Empleado:" type="number" name="empleado_id" value={formData.empleado_id} onChange={handleInputChange} disabled />
                                )}
                                <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-400">Rol</label>
                                    <select name="rol" id="rol" value={formData.rol} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="" disabled>Seleccione un rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.codigo} value={rol.codigo}>{rol.descripcion}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input label="Nombre:" type="text" name="nombre" value={formData.empleado.nombre} onChange={handleEmpleadoChange} error={errorNombre} />
                                {isCreating && (
                                    <Input label='Contraseña:' type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} />
                                )}
                            </div>
                            {/* Columna 2 */}
                            <div className="space-y-4">
                                <Input label='Apellido:' type="text" name="apellido" value={formData.empleado.apellido} onChange={handleEmpleadoChange} error={errorApellido} />
                                <Input label='Correo Electrónico:' type="email" name="correo_electronico" value={formData.empleado.correo_electronico} onChange={handleEmpleadoChange} error={errorCorreo} />
                                {!isCreating && formData.isNuevaContrasena === 1 && (
                                    <Input label='Nueva Contraseña:' type="password" name="nuevaContrasena" value={formData.nuevaContrasena || ''} onChange={handleInputChange} />
                                )}
                                <div className="flex items-center pt-6 space-x-4">
                                    <input type="checkbox" name="activo" id="activo" checked={formData.activo === 1} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-slate-800" />
                                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">Activo</label>
                                    {!isCreating && (
                                        <>
                                            <input type="checkbox" name="isNuevaContrasena" id="isNuevaContrasena" checked={formData.isNuevaContrasena === 1} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-slate-800" />
                                            <label htmlFor="isNuevaContrasena" className="ml-2 block text-sm text-gray-300">Nueva Contraseña</label>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Botones */}
                            <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                                <Button type="button" variant="secondary" onClick={handleCancel}>Cancelar</Button>
                                <Button type="submit" variant="primary">Guardar</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <Button onClick={handleCreateClick} variant="primary">Crear Nuevo Usuario</Button>
                            <Button variant="secondary" onClick={() => window.history.back()}>Volver</Button>
                        </div>

                        {/* Filtros */}
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Filtrar por Nombre o Apellido:"
                                type="text"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                placeholder="Buscar por nombre..."
                            />
                            <Input
                                label="Filtrar por ID de Empleado:"
                                type="text"
                                value={filtroId}
                                onChange={(e) => setFiltroId(e.target.value)}
                                placeholder="Buscar por ID..."
                            />
                        </div>

                        <div className="bg-slate-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-700/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Empleado</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre Completo</th>
                                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Correo Electrónico</th>
                                            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                                        {filteredUsuarios.map((usuario) => (
                                            <tr key={usuario.empleado_id} className="hover:bg-slate-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{usuario.empleado_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{`${usuario.empleado.nombre} ${usuario.empleado.apellido}`}</td>
                                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-400">{usuario.empleado.correo_electronico}</td>
                                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-400">{usuario.rol}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button onClick={() => handleEditClick(usuario)} variant="primary">Editar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UsuariosForm;