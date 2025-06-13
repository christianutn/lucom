import AppError from "../utils/appError.js";
import DatosServiciosConvergencias from "../models/dato_servicio_convergencia.models.js";
import { Op } from "sequelize";

export const getDatosServiciosConvergencia = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.activo) where.activo = req.query.activo;
        if (req.query.descripcion) where.descripcion = { [Op.like]: `%${req.query.descripcion}%` };
        const datosServiciosConvergencia = await DatosServiciosConvergencias.findAll({ where });

        if (datosServiciosConvergencia.length === 0) {
            return next(new AppError('No se encontraron companias', 404));
        }
        res.status(200).json(datosServiciosConvergencia);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

export const getDatosServiciosConvergenciaPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const datoServicioConvergencia = await DatosServiciosConvergencias.findByPk(id);
        if (!datoServicioConvergencia) {
            return next(new AppError(`Servicio de convergencia con ID ${id} no encontrado`, 404));
        }
        res.status(200).json(datoServicioConvergencia);
    } catch (error) {
        next(new AppError('Error al obtener la compania', 500));
    }
};

export const createDatoServicioConvergencia = async (req, res, next) => {
    try {
        const datoServicioConvergencia = await DatosServiciosConvergencias.create({
            descripcion: req.body.descripcion.trim()
        });
        res.status(201).json(datoServicioConvergencia);
    } catch (error) {
        next(new AppError('Error al crear la compania', 500));
    }
};


export const actualizarDatoServicioConvergencia = async (req, res, next) => {
    try {
        const { descripcion, activo } = req.body;

        const dataActualizada = {}

        dataActualizada.descripcion = descripcion.trim();
        
        if(req.body.hasOwnProperty('activo')) dataActualizada.activo = activo;


        const [actualizado] = await DatosServiciosConvergencias.update(
            dataActualizada,
            {
                where: {
                    id: req.params.id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await DatosServiciosConvergencias.findByPk(req.params.id);

        res.status(200).json(dataModificada);


    } catch (error) {
        next(new AppError('Error al actualizar la Datos de Servicio de Convergencia', 500));
    }
};