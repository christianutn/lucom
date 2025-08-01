import { useState, useEffect, FormEvent } from 'react';
import { getTiposDomicilios, putTipoDomicilio, postTipoDomicilio } from '../../services/tipos_domicilios';
import { ITipoDomicilio, ITipoDomicilioUpdate, ITipoDomicilioCreate } from '../../types';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import Input from '../common/Input';
import { Plus, Edit, ArrowLeft } from 'lucide-react';

const emptyTipoDomicilio: ITipoDomicilio = {
    id: 0,
    descripcion: '',
    activo: 1,
};

const TipoDomicilioForm = () => {
    const [tiposDomicilios, setTiposDomicilios] = useState<ITipoDomicilio[]>([]);
    const [selectedTipoDomicilio, setSelectedTipoDomicilio] = useState<ITipoDomicilio | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<ITipoDomicilio>(emptyTipoDomicilio);
    const { showNotification } = useNotification();

    const [errorDescripcion, setErrorDescripcion] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const tiposDomiciliosRes = await getTiposDomicilios();
                setTiposDomicilios(tiposDomiciliosRes);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Error al cargar los tipos de domicilio', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedTipoDomicilio) {
            setFormData(selectedTipoDomicilio);
        } else {
            setFormData(emptyTipoDomicilio);
        }
    }, [selectedTipoDomicilio]);

    const handleCreateClick = () => {
        setSelectedTipoDomicilio(null);
        setIsCreating(true);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleEditClick = (tipoDomicilio: ITipoDomicilio) => {
        setSelectedTipoDomicilio(tipoDomicilio);
        setIsCreating(false);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setSelectedTipoDomicilio(null);
        setErrorDescripcion('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const inputValue = isCheckbox ? ((e.target as HTMLInputElement).checked ? 1 : 0) : value;
        setFormData(prev => ({ ...prev, [name]: inputValue }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (errorDescripcion) {
            showNotification('Por favor, corrige los errores antes de guardar', 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (isCreating) {
                const tipoDomicilioCreacion: ITipoDomicilioCreate = {
                    descripcion: formData.descripcion,
                };
                await postTipoDomicilio(tipoDomicilioCreacion);
                showNotification('Tipo de Domicilio creado correctamente', 'success');
            } else {
                const tipoDomicilioUpdate: ITipoDomicilioUpdate = {
                    id: formData.id,
                    descripcion: formData.descripcion,
                    activo: formData.activo
                };
                await putTipoDomicilio(tipoDomicilioUpdate);
                showNotification('Tipo de Domicilio actualizado correctamente', 'success');
            }

            const tiposDomiciliosRes = await getTiposDomicilios();
            setTiposDomicilios(tiposDomiciliosRes);
            setIsFormVisible(false);
            setSelectedTipoDomicilio(null);
            setFormData(emptyTipoDomicilio);
        } catch (error) {
            showNotification('Error: Revisar datos de entrada del formulario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-300 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Gestión de Tipos de Domicilio</h1>

                {isLoading && <Spinner />}

                {isFormVisible ? (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">{isCreating ? 'Crear Nuevo Tipo de Domicilio' : 'Editar Tipo de Domicilio'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="ID Tipo Domicilio:" type="number" name="id" value={formData.id} disabled={!isCreating} />
                            <Input label="Descripción:" type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} error={errorDescripcion}  required/>
                            {!isCreating && (
                                <div className="flex items-center pt-6 space-x-4">
                                    <input type="checkbox" name="activo" id="activo" checked={formData.activo === 1} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-gray-800" />
                                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">Activo</label>
                                </div>
                            )}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button type="button" variant="secondary" onClick={handleCancel}>Cancelar</Button>
                                <Button type="submit" variant="primary">Guardar</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <Button onClick={handleCreateClick} variant="primary" className="flex items-center gap-2">
                                <Plus size={20} />
                                <span>Crear Nuevo Tipo de Domicilio</span>
                            </Button>
                            <Button variant="secondary" onClick={() => window.history.back()} className="flex items-center gap-2">
                                <ArrowLeft size={20} />
                                <span>Volver</span>
                            </Button>
                        </div>
                        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {tiposDomicilios.map((tipo) => (
                                            <tr key={tipo.id} className="hover:bg-gray-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tipo.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{tipo.descripcion}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tipo.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {tipo.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button onClick={() => handleEditClick(tipo)} variant="primary" className="flex items-center gap-1">
                                                        <Edit size={16} />
                                                        <span>Editar</span>
                                                    </Button>
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

export default TipoDomicilioForm;