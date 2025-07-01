import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import OrigenDato from "../models/origen_dato.models.js";
import { Request, Response, NextFunction } from "express";
import { IOrigenDatoAttributes, IOrigenDatoCreate, IOrigenDatoUpdate } from "../types/origen_dato.d.js";
export const  getOrigenDato = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IOrigenDatoAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo == "1" ? 1 : 0; 
        const origen = await OrigenDato.findAll({
            where: where
        });
        res.status(200).json(origen);
    } catch (error) {
        next(new AppError('Error al obtener los Origen de Datos', 500));
    }
}


export const  getOrigenDatoPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const origen = await OrigenDato.findByPk(req.params.id);

        if (!origen) {
            return next(new AppError(`Origen de datos con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(origen);
    } catch (error) {
        next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createOrigenDato= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const origenData : IOrigenDatoCreate = {
            descripcion: req.body.descripcion
        };
        const origen = await OrigenDato.create(origenData);
        res.status(201).json(origen);
    } catch (error) {
        next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarOrigenDato= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : IOrigenDatoUpdate = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descricion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await OrigenDato.update(
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

        const dataModificada = await OrigenDato.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarOrigenDato = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const origen = await OrigenDato.findByPk(id);
        if (!origen) {
            return next(new AppError(`Giga con ID ${id} no encontrado`, 404));
        }
        const origenEliminado : IOrigenDatoAttributes = await origen.update({ activo: 0 });
        res.status(204).send(origenEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


