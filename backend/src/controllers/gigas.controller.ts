import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import Giga from "../models/giga.models.js";
import { Request, Response, NextFunction } from "express";
import { IGigaAttributes, IGigaCreate, IGigaUpdate } from "../types/gigas.js";

export const  getGigas = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IGigaAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo == "1" ? 1 : 0;
        const gigas = await Giga.findAll({
            where: where
        });
        res.status(200).json(gigas);
    } catch (error) {
        next(new AppError('Error al obtener los gigas', 500));
    }
}


export const  getGigaPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const giga = await Giga.findByPk(req.params.id);

        if (!giga) {
            return next(new AppError(`Giga con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(giga);
    } catch (error) {
        next(new AppError(`Error al buscar giga con id: ${req.params.id}`, 500));
    }
}



export const createGiga= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const descricionData: IGigaCreate = {
            descripcion: req.body.descricion
        };

        const giga = await Giga.create(descricionData);
        res.status(201).json(giga);
    } catch (error) {
        next(new AppError('Error al crear el giga', 500));
    }
}




export const actualizarGiga= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { descricion, activo } = req.body;
    const objetoActualizado: IGigaUpdate = {};


    try {
        if (req.body.hasOwnProperty('descricion')) objetoActualizado.descripcion = req.body.descricion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        if( Object.keys(objetoActualizado).length === 0) {
            return next(new AppError('No se proporcionaron campos para actualizar', 400));
        }

        const [actualizado] = await Giga.update(
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

        const dataModificada = await Giga.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarGiga = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const giga = await Giga.findByPk(id);
        if (!giga) {
            return next(new AppError(`Giga con ID ${id} no encontrado`, 404));
        }
        const gigasEliminado : IGigaAttributes = await giga.update({ activo: 0 });
        res.status(204).send(gigasEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


