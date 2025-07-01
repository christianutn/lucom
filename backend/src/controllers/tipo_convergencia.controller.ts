import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import TipoConvergencia from "../models/tipo_convergencia.models.js";
import { Request, Response, NextFunction } from "express";
import { ITipoConvergenciaAttributes, ITipoConvergenciaCreate, ITipoConvergenciaUpdate } from "../types/tipo_convergencia.d.js";
export const  getTipoConvergencia = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<ITipoConvergenciaAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; 
        const tipoConvergencia = await TipoConvergencia.findAll({
            where: where
        });
        res.status(200).json(tipoConvergencia);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de convergencias', 500));
    }
}


export const  getTipoConvergenciaPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tipoConvergencia = await TipoConvergencia.findByPk(req.params.id);

        if (!tipoConvergencia) {
            return next(new AppError(`Tipo de Convergencia con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoConvergencia);
    } catch (error) {
        next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoConvergencia= async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tipoConvergenciaData: ITipoConvergenciaCreate = {
            descripcion: req.body.descripcion
        }
        const tipoConvergencia = await TipoConvergencia.create(tipoConvergenciaData);
        res.status(201).json(tipoConvergencia);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de Convergencias', 500));
    }
}




export const actualizarTipoConvergencia= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : ITipoConvergenciaUpdate = {};


    try {
        if (req.body.hasOwnProperty('descricion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo
        if (Object.keys(objetoActualizado).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }
        const [actualizado] = await TipoConvergencia.update(
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

        const dataModificada = await TipoConvergencia.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoConvergencia = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const tipoConvergencia = await TipoConvergencia.findByPk(id);
        if (!tipoConvergencia) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        const tipoConvergenciaEliminado : ITipoConvergenciaAttributes = await tipoConvergencia.update({ activo: 0 });
        res.status(204).send(tipoConvergenciaEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


