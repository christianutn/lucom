import AppError from "../utils/appError.js";
import Compania from "../models/compania.models.js";
import { Op } from "sequelize";

export const getCompanias = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.activo) where.activo = req.query.activo;
        if (req.query.descripcion) where.descripcion = { [Op.like]: `%${req.query.descripcion}%` };
        const companias = await Compania.findAll({ where });

        if (companias.length === 0) {
            return next(new AppError('No se encontraron companias', 404));
        }
        res.status(200).json(companias);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

export const getCompaniaPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const compania = await Compania.findByPk(id);
        if (!compania) {
            return next(new AppError(`Compania con ID ${id} no encontrado`, 404));
        }
        res.status(200).json(compania);
    } catch (error) {
        next(new AppError('Error al obtener la compania', 500));
    }
};

export const createCompania = async (req, res, next) => {
    try {
        const compania = await Compania.create({
            descripcion: req.body.descripcion.trim()
        });
        res.status(201).json(compania);
    } catch (error) {
        next(new AppError('Error al crear la compania', 500));
    }
};


export const actualizarCompania = async (req, res, next) => {
    try {
        const { descripcion, activo } = req.body;

        const companiaActualizada = {}

        companiaActualizada.descripcion = descripcion.trim();
        
        if(req.body.hasOwnProperty('activo')) companiaActualizada.activo = activo;


        const [actualizado] = await Compania.update(
            companiaActualizada,
            {
                where: {
                    id: req.params.id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const companiaModificada = await Compania.findByPk(req.params.id);

        res.status(200).json(companiaActualizada);


    } catch (error) {
        next(new AppError('Error al actualizar la compania', 500));
    }
};