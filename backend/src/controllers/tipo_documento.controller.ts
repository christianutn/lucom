import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import TipoDocumento from "../models/tipo_documento.models.js";
import { Request, Response, NextFunction } from "express";
import { ITipoDocumentoAttributes, ITipoDocumentoCreate, ITipoDocumentoUpdate } from "../types/tipo_documento.d.js";
export const  getTipoDocumento = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<ITipoDocumentoAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; 
        const tipoDocumento = await TipoDocumento.findAll({
            where: where
        });
        res.status(200).json(tipoDocumento);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de convergencias', 500));
    }
}


export const  getTipoDocumentoPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tipoDocumento = await TipoDocumento.findByPk(req.params.id);

        if (!tipoDocumento) {
            return next(new AppError(`Tipo de Convergencia con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoDocumento);
    } catch (error) { 
         next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoDocumento= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tipoDocumentoData: ITipoDocumentoCreate = {
            descripcion: req.body.descripcion
        }
        const tipoDocumento = await TipoDocumento.create(tipoDocumentoData);
        res.status(201).json(tipoDocumento);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de Convergencias', 500));
    }
}




export const actualizarTipoDocumento= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : ITipoDocumentoUpdate = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion 
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo == '1' ? 1 : 0

        const [actualizado] = await TipoDocumento.update(
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

        const dataModificada = await TipoDocumento.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoDocumento = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const descripcion = await TipoDocumento.findByPk(id);
        if (!descripcion) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        const descripcionEliminado : ITipoDocumentoAttributes = await descripcion.update({ activo: 0 });
        res.status(204).send(descripcionEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


