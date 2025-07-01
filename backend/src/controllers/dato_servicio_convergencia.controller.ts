import AppError from "../utils/appError.js";
import DatoServicioConvergencia from "../models/dato_servicio_convergencia.models.js";
import { Op, WhereOptions } from "sequelize";
import { Request, Response, NextFunction } from "express";
import { IDatosServicioConvergenciaAttributes, IDatosServicioConvergenciaCreate, IDatosServicioConvergenciaUpdate, IDatosServicioConvergenciaFilter } from "../types/dato_servicio_convergencia.d.js";

export const getDatoServicioConvergencias = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const where: WhereOptions<IDatosServicioConvergenciaAttributes> = {};

        if (req.query.descripcion)
            where.descripcion = { [Op.like]: `%${req.query.descripcion}%` };

        if (req.query.activo)
            where.activo = parseInt(req.query.activo as string, 10) as 0 | 1;

        

        const datoServicioConvergencias = await DatoServicioConvergencia.findAll({
            where
        });

        res.status(200).json(datoServicioConvergencias);

    } catch (error) {
        return next(new AppError('Error al obtener los DatoServicioConvergencias', 500));
    }
};

export const getDatoServicioConvergenciaPorId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const datoServicioConvergencia = await DatoServicioConvergencia.findByPk(id);
        if (!datoServicioConvergencia) {
            return next(new AppError(`DatoServicioConvergencia con ID ${id} no encontrado`, 404));
        }
        res.status(200).json(datoServicioConvergencia);
    } catch (error) {
        return next(new AppError('Error al obtener el DatoServicioConvergencia', 500));
    }
};

export const createDatoServicioConvergencia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { descripcion } = req.body;
        const datoServicioConvergencia = await DatoServicioConvergencia.create({
            descripcion: descripcion,
            activo: 1
        });
        res.status(201).json(datoServicioConvergencia);
    } catch (error) {
       return next(new AppError('Error al crear el DatoServicioConvergencia', 500));
    }
};


export const eliminarDatoServicioConvergencia = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const datoServicioConvergencia = await DatoServicioConvergencia.findByPk(id);
        if (!datoServicioConvergencia) {
            return next(new AppError(`DatoServicioConvergencia con ID ${id} no encontrado`, 404));            
        }
        const datoServConvEliminado : IDatosServicioConvergenciaAttributes = await datoServicioConvergencia.update({ activo: 0 });
        res.status(204).json(datoServConvEliminado);
    } catch (error) {
        return next(new AppError('Error al eliminar la DatoServicioConvergencia', 500));
    }
};

export const actualizarDatoServicioConvergencia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const DatoServicioConvergenciaActualizado: IDatosServicioConvergenciaUpdate = {};

        const { descripcion, activo } = req.body;

        if (descripcion) DatoServicioConvergenciaActualizado.descripcion = descripcion;
        if (activo !== undefined) DatoServicioConvergenciaActualizado.activo = activo;

        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(DatoServicioConvergenciaActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await DatoServicioConvergencia.update(DatoServicioConvergenciaActualizado, {
            where: { id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el DatoServicioConvergencia no existe' });
            return;
        }

        const DatoServicioConvergenciaModificado = await DatoServicioConvergencia.findByPk(id);

        res.status(200).json(DatoServicioConvergenciaModificado);
    } catch (error) {
       return next(new AppError('Error al actualizar el DatoServicioConvergencia', 500));
    }
};


