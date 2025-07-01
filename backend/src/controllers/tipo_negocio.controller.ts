import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import TipoNegocio from "../models/tipo_negocio.models.js";
import { Request, Response, NextFunction } from "express";
import { ITipoNegocioAttributes, ITipoNegocioCreate, ITipoNegocioUpdate } from "../types/tipo_negocio.d.js";

export const  getTipoNegocio = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<ITipoNegocioAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; 
        const tipoNegocio = await TipoNegocio.findAll({
            where: where
        });
        res.status(200).json(tipoNegocio);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de negocio', 500));
    }
}


export const  getTipoNegocioPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tipoNegocio = await TipoNegocio.findByPk(req.params.id);

        if (!tipoNegocio) {
            return next(new AppError(`Tipo de negocio con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoNegocio);
    } catch (error) { 
         next(new AppError(`Error al buscar tipo de negocio con id: ${req.params.id}`, 500));
    }
}



export const createTipoNegocio= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tipoNegocioData: ITipoNegocioCreate = {
            descripcion: req.body.descripcion,
        }
        const tipoNegocio = await TipoNegocio.create(tipoNegocioData);
        res.status(201).json(tipoNegocio);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de negocio', 500));
    }
}




export const actualizarTipoNegocio= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : ITipoNegocioUpdate = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        if (Object.keys(objetoActualizado).length === 0) {
            return next(new AppError('No hay atributos para actualizar', 400));
        }
        const [actualizado] = await TipoNegocio.update(
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

        const dataModificada = await TipoNegocio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el tipo de negocio', 500));
    }
};



export const eliminarTipoNegocio = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const tipoNegocio = await TipoNegocio.findByPk(id);
        if (!tipoNegocio) {
            return next(new AppError(`Tipo de negocio con ID ${id} no encontrado`, 404));
        }
        const tipoNegocioEliminado : ITipoNegocioAttributes = await tipoNegocio.update({ activo: 0 });
        res.status(204).send(tipoNegocioEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de negocio', 500));
    }
}


