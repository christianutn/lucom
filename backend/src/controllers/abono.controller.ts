import Abono from '../models/abono.models.js';
import AppError from '../utils/appError.js';
import { Op, WhereOptions } from 'sequelize';
import { NextFunction, Request, Response } from 'express';
import { IAbonoAttributes, IAbonoCreate, IAbonoFilter, IAbonoUpdate } from '../types/abono.d.js';


export const getAbonos = async (req: Request, res: Response, next: NextFunction) => {
    const { activo, descripcion, codigo_postal } = req.query;
    try {
        const where: WhereOptions<IAbonoAttributes> = {};
        if (activo) where.activo = parseInt(activo as string);
        if (descripcion) where.descripcion = { [Op.like]: `%${descripcion}%` };
        

        const abonos = await Abono.findAll({ where });
        
        res.status(200).json(abonos);
    } catch (error) {
        next(new AppError('Error al obtener los Abonos', 500));
    }
};

export const getAbonoById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const abono = await Abono.findByPk(id);
        if (!abono) {
            return next(new AppError(`Abono con ID ${id} no encontrado`, 404));
        }
        res.status(200).json({
            id: abono.id,
            descripcion: abono.descripcion,
            activo: abono.activo,
        });
    } catch (error) {
        next(new AppError('Error al obtener el Abono', 500));
    }
};


export const createAbono = async (req: Request, res: Response, next: NextFunction) => {
    const { descripcion } = req.body;
    try {


        const newAbono = await Abono.create({ descripcion: descripcion.trim() });

        
        res.status(201).json({
            id: newAbono.id,
            descripcion: newAbono.descripcion,
            activo: newAbono.activo,
        });
    } catch (error) {
        next(new AppError('Error al crear el abono', 500));
    }
};


export const actualizarAbono = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { descripcion, activo} = req.body;
        const abono = await Abono.findByPk(id);
        if (!abono) {
            return next(new AppError(`Abono con ID ${id} no encontrado`, 404));
        }
        await abono.update({ descripcion: descripcion.trim(), activo: activo == true || activo == 1 ? 1 : 0 });

        res.status(200).json({
            id: abono.id,
            descripcion: abono.descripcion,
            activo: abono.activo,
        });

    } catch (error) {
        next(new AppError('Error al actualizar el abono', 500));

    }
}

export const eliminarAbono = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const abono = await Abono.findByPk(id);
        if (!abono) {
            return next(new AppError(`Abono con ID ${id} no encontrado`, 404));
        }
        const abonoEliminado : IAbonoAttributes = await abono.update({ activo: 0 });


        res.status(200).send(abonoEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el abono', 500));
    }
};