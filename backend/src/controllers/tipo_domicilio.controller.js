import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
export const  getTipoDomicilio = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const tipoDomicilio = await TipoDomicilio.findAll({
            where: where
        });
        res.status(200).json(tipoDomicilio);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de domicilios', 500));
    }
}


export const  getTipoDomicilioPorId = async (req, res, next) => {
    try {

        const tipoDomicilio = await TipoDomicilio.findByPk(req.params.id);

        if (!tipoDomicilio) {
            return next(new AppError(`Tipo de domicilios con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoDomicilio);
    } catch (error) { 
         next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoDomicilio= async (req, res, next) => {
    try {
        const tipoDomicilio = await TipoDomicilio.create(req.body);
        res.status(201).json(tipoDomicilio);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de domicilios', 500));
    }
}




export const actualizarTipoDomicilio= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await TipoDomicilio.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await TipoDomicilio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoDomicilio = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const descripcion = await TipoDomicilio.findByPk(id);
        if (!descripcion) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        await descripcion.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


