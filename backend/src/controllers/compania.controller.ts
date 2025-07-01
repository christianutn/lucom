import AppError from "../utils/appError.js";
import Compania from "../models/compania.models.js";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";
import { WhereOptions } from "sequelize";
import { ICompaniaAttributes, ICompaniaCreate, ICompaniaUpdate } from "../types/compania.d.js";
import { parse } from "path";

export const getCompanias = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const where: WhereOptions<ICompaniaAttributes> = {};

        if (req.query.descripcion)
            where.descripcion = { [Op.like]: `%${req.query.descripcion}%` };

        if (req.query.activo)
            where.activo = parseInt(req.query.activo as string, 10) as 0 | 1;

        

        const companias = await Compania.findAll({
            where
        });

        res.status(200).json(companias);

    } catch (error) {
        return next(new AppError('Error al obtener los Companias', 500));
    }
};

export const getCompaniaPorId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const compania = await Compania.findByPk(id);
        if (!compania) {
            return next(new AppError(`Compania con ID ${id} no encontrado`, 404));
        }
        res.status(200).json(compania);
    } catch (error) {
        return next(new AppError('Error al obtener el Compania', 500));
    }
};

export const createCompania = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { descripcion } = req.body;
        const compania = await Compania.create({
            descripcion: descripcion,
            activo: 1
        });
        res.status(201).json(compania);
    } catch (error) {
       return next(new AppError('Error al crear el Compania', 500));
    }
};


export const eliminarCompania = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const compania = await Compania.findByPk(id);
        if (!compania) {
            return next(new AppError(`Compania con ID ${id} no encontrado`, 404));
        }
        const companiaEliminado: ICompaniaAttributes = await compania.update({ activo: 0 });
        
        res.status(204).json(companiaEliminado);
    } catch (error) {
        return next(new AppError('Error al eliminar la Compania', 500));
    }
};

export const actualizarCompania = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const companiaActualizado: ICompaniaUpdate = {};

        const { descripcion, activo } = req.body;

        if (descripcion) companiaActualizado.descripcion = descripcion;
        if (activo !== undefined) companiaActualizado.activo = activo;

        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(companiaActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await Compania.update(companiaActualizado, {
            where: { id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el Compania no existe' });
            return;
        }

        const CompaniaModificado = await Compania.findByPk(id);

        res.status(200).json(CompaniaModificado);
    } catch (error) {
       return next(new AppError('Error al actualizar el Compania', 500));
    }
};


