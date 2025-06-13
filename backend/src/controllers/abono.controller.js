import Abono from '../models/abono.models.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';

export const getAbonos = async (req, res, next) => {
    const { activo, descripcion } = req.query;
    try {
        const where = {};
        if (activo) {
            where.activo = activo;
        }
        if (descripcion) {
            where.descripcion = { [Op.like]: `%${descripcion}%` };
        }

        const abonos = await Abono.findAll({ where });

        if (abonos.length === 0) {
            return next(new AppError('No se encontraron abonos', 404));
        }
        res.json(abonos.map(abono => ({
            descripcion: abono.descripcion,
            activo: abono.activo,
        })));
    } catch (error) {
        next(new AppError('Error al obtener los abonos', 500));
    }
};


export const getAbonoById = async (req, res, next) => {
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
        next(new AppError('Error al obtener el abono', 500));
    }
}


export const createAbono = async (req, res, next) => {
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


export const actualizarAbono = async (req, res, next) => {
    try {
        const { descripcion, activo, id } = req.body;
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

export const eliminarAbono = async (req, res, next) => {
    const { id } = req.params;
    try {
        const abono = await Abono.findByPk(id);
        if (!abono) {
            return next(new AppError(`Abono con ID ${id} no encontrado`, 404));
        }
        await abono.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el abono', 500));
    }
};