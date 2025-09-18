// App.tsx
import React, { useState, useEffect } from "react";
import PortaBlock from "./PortabilidadBlocks";
import { getGigas, getCompanias } from '../../../../services/api.js';
import { SelectOption, PortabilidadState, Cliente } from '../../../../types.js';
import { useNotification } from '../../../../hooks/useNotification.js';
import Button from '@/components/common/Button.js';
import { SquarePlus, Trash } from 'lucide-react';


interface PortabilidadFormProps {
    data: PortabilidadState[];
    // si después querés levantar cambios al padre, podés agregar:
    onChange: <K extends keyof PortabilidadState>(
        field: K,
        index: number,
        value: PortabilidadState[K]
    ) => void;

    onDeletePortabilidad: (index: number) => void;
    onAddPortabilidad: () => void;
    handleErrors: (field: string, message: string) => void;
}

const PortabilidadFormPrincipal: React.FC<PortabilidadFormProps> = ({ data, onChange, onDeletePortabilidad, onAddPortabilidad, handleErrors }) => {

    const [gigasOptions, setGigasOptions] = useState<SelectOption[]>([]);
    const [companiasOptions, setCompaniasOptions] = useState<SelectOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification } = useNotification();



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [gigasRes, companiasRes] = await Promise.all([
                    getGigas(),
                    getCompanias()
                ]);
                setGigasOptions(
                    gigasRes
                        .filter((giga: SelectOption) => giga.activo === 1)
                        .map((giga: SelectOption) => ({ id: giga.id, descripcion: giga.descripcion, activo: giga.activo }))
                );
                setCompaniasOptions(companiasRes);
            } catch (error) {
                console.error("Error fetching Portabilidad form data:", error);
                showNotification("Error al cargar datos para Portabilidad.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [showNotification]);


    const handleRemoveBlock = (index: number) => {
        onDeletePortabilidad(index)
    };

    const handleChange = <K extends keyof PortabilidadState>(
        field: K,
        index: number,
        value: PortabilidadState[K]
    ) =>  {
        onChange(field, index, value);
    };



    return (
        <>
            {data && data.length > 0 && data.map((block, index) => (
                <PortaBlock
                    key={index}
                    index={index}
                    data={block}
                    onChange={handleChange}
                    onRemove={handleRemoveBlock}
                    gigasOptions={gigasOptions}
                    companiasOptions={companiasOptions}
                />
            ))}
            <Button
                type="button"
                onClick={onAddPortabilidad}
                className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                title="Agregar NIM"
            >
                <SquarePlus size={17} />
            </Button>


        </>
    );
};

export default PortabilidadFormPrincipal;
