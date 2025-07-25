import { useState, useEffect, FormEvent } from 'react';
import { getAbonos, putAbono, postAbono } from '../../services/abonos';
import { IAbono, IAbonoUpdate, IAbonoCreate } from '../../types';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import Input from '../common/Input';

const emptyAbono: IAbono = {
    id: 0,
    descripcion: '',
    activo: 1,
};

const AbonoForm = () => {
    const [abonos, setAbonos] = useState<IAbono[]>([]);
    const [selectedAbono, setSelectedAbono] = useState<IAbono | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<IAbono>(emptyAbono);
    const { showNotification } = useNotification();

    const [errorDescripcion, setErrorDescripcion] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const abonosRes = await getAbonos();
                setAbonos(abonosRes);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Error al cargar los abonos', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedAbono) {
            setFormData(selectedAbono);
        } else {
            setFormData(emptyAbono);
        }
    }, [selectedAbono]);

    const handleCreateClick = () => {
        setSelectedAbono(null);
        setIsCreating(true);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleEditClick = (abono: IAbono) => {
        setSelectedAbono(abono);
        setIsCreating(false);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setSelectedAbono(null);
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
                const abonoCreacion: IAbonoCreate = {
                    descripcion: formData.descripcion,
                };
                await postAbono(abonoCreacion);
                showNotification('Abono creado correctamente', 'success');
            } else {
                const abonoUpdate: IAbonoUpdate = {
                    id: formData.id,
                    descripcion: formData.descripcion,
                    activo: formData.activo
                };
                await putAbono(abonoUpdate);
                showNotification('Abono actualizado correctamente', 'success');
            }

            const abonosRes = await getAbonos();
            setAbonos(abonosRes);
            setIsFormVisible(false);
            setSelectedAbono(null);
            setFormData(emptyAbono);
        } catch (error) {
            showNotification('Error: Revisar datos de entrada del formulario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 text-gray-300 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Gestión de Abonos</h1>

                {isLoading && <Spinner />}

                {isFormVisible ? (
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">{isCreating ? 'Crear Nuevo Abono' : 'Editar Abono'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna 1 */}
                            <div className="space-y-4">
                                {!isCreating && (
                                    <Input label="ID Abono:" type="number" name="id" value={formData.id} disabled />
                                )}
                                <Input label="Descripción:" type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} error={errorDescripcion}  required/>
                            </div>
                            {/* Columna 2 */}
                            {
                                !isCreating && (
                                    <div className="space-y-4">
                                        <div className="flex items-center pt-6 space-x-4">
                                            <input type="checkbox" name="activo" id="activo" checked={formData.activo === 1} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-slate-800" />
                                            <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">Activo</label>
                                        </div>
                                    </div>
                                )
                            }
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
                            <Button onClick={handleCreateClick} variant="primary">Crear Nuevo Abono</Button>
                            <Button variant="secondary" onClick={() => window.history.back()}>Volver</Button>
                        </div>
                        <div className="bg-slate-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-700/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Abono</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                                        {abonos.map((abono) => (
                                            <tr key={abono.id} className="hover:bg-slate-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{abono.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{`${abono.descripcion}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${abono.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {abono.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button onClick={() => handleEditClick(abono)} variant="primary">Editar</Button>
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

export default AbonoForm;