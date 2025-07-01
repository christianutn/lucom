import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import Rol from "../models/rol.models.js";
import { Request, Response, NextFunction } from "express";
import { IRolAttributes, IRolCreate, IRolUpdate } from "../types/rol.d.js";
export const  getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IRolAttributes> = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo == "1" ? 1 : 0; 

        const rol = await Rol.findAll({
            where: where
        });
        res.status(200).json(rol);
    } catch (error) {
        next(new AppError('Error al obtener los Roles', 500));
    }
}


export const  getRolesPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const rol = await Rol.findByPk(req.params.codigo);

        if (!rol) {
            return next(new AppError(`Roles con ID ${req.params.codigo} no encontrado`, 404));
        }
        res.status(200).json(rol);
    } catch (error) {
        return next(new AppError(`Error al buscar Roless con id: ${req.params.codigo}`, 500));
    }
}



export const createRol= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rolData : IRolCreate = {
            descripcion: req.body.descripcion
        };
        const rol = await Rol.create(rolData);
        res.status(201).json(rol);
    } catch (error) {
        next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarRol= async (req: Request, res: Response, next: NextFunction) => {
    const { codigo } = req.params;

    const objetoActualizado : IRolUpdate = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo 


        if(Object.keys(objetoActualizado).length === 0) {
            return next(new AppError('No se proporcionaron campos para actualizar', 400));
        }
        const [actualizado] = await Rol.update(
            objetoActualizado,
            {
                where: {
                    codigo: codigo
                }
            });

        if (actualizado == 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }

        const dataModificada = await Rol.findByPk(codigo);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el rol', 500));
    }
};



export const eliminarRol = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { codigo } = req.params;

        const rol = await Rol.findByPk(codigo);
        if (!rol) {
            return next(new AppError(`Rol con ID ${codigo} no encontrado`, 404));
        }
        const rolEliminado : IRolAttributes = await rol.update({ activo: 0 });
        res.status(204).send(rolEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


