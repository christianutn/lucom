import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import { Request, Response, NextFunction } from "express";
import { ITipoDomicilioAttributes, ITipoDomicilioCreate, ITipoDomicilioUpdate } from "../types/tipo_domicilio.d.js";
export const  getTipoDomicilio = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<ITipoDomicilioAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; 
        const tipoDomicilio = await TipoDomicilio.findAll({
            where: where
        });
        res.status(200).json(tipoDomicilio);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de domicilios', 500));
    }
}


export const  getTipoDomicilioPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tipoDomicilio = await TipoDomicilio.findByPk(req.params.id);

        if (!tipoDomicilio) {
            return next(new AppError(`Tipo de domicilios con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoDomicilio);
    } catch (error) { 
         return next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoDomicilio= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tipoDomicilioData: ITipoDomicilioCreate = {
            descripcion: req.body.descripcion,
        }
        const tipoDomicilio = await TipoDomicilio.create(tipoDomicilioData);
        res.status(201).json(tipoDomicilio);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de domicilios', 500));
    }
}




export const actualizarTipoDomicilio= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : ITipoDomicilioUpdate = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        if (Object.keys(objetoActualizado).length === 0) {
            return next(new AppError('No hay atributos para actualizar', 400));
        }

        const [actualizado] = await TipoDomicilio.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }

        const dataModificada = await TipoDomicilio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoDomicilio = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const descripcion = await TipoDomicilio.findByPk(id);
        if (!descripcion) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        const descripcionEliminado : ITipoDomicilioAttributes = await descripcion.update({ activo: 0 });
        res.status(204).send(descripcionEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


