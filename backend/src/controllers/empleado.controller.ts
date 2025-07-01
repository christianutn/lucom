import Empleado from "../models/empleado.models.js";
import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import { Request, Response, NextFunction } from "express";
import { IEmpleadoAttributes, IEmpleadoCreate, IEmpleadoUpdate } from "../types/empleado.d.js";


export const  getEmpleados = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IEmpleadoAttributes> = {};


        if (req.query.hasOwnProperty('nombre')) where.nombre =  { [Op.like]: `%${req.query.nombre}%` };;
        if (req.query.hasOwnProperty('apellido')) where.apellido = { [Op.like]: `%${req.query.apellido}%` };
        if (req.query.hasOwnProperty('correo_electronico')) where.correo_electronico = { [Op.like]: `%${req.query.correo_electronico}%` };
        if (req.query.hasOwnProperty('activo')) where.activo = parseInt(req.query.activo as string, 10);
        
        const empelado = await Empleado.findAll({
            where: where
        });
        res.status(200).json(empelado);
    } catch (error) {
        next(new AppError('Error al obtener los empleados', 500));
    }
}


export const  getEmpleadosPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const empelado = await Empleado.findByPk(req.params.id);

        if (!empelado) {
            return next(new AppError(`Empleado con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(empelado);
    } catch (error) {
        next(new AppError(`Error al buscar empleado con id: ${req.params.id}`, 500));
    }
}



export const createEmpleado= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, apellido, correo_electronico } = req.body;

        // Validar campos obligatorios
        if ([nombre, apellido, correo_electronico].some(field => !field)) {
            return next(new AppError('Los campos nombre, apellido y correo_electronico son obligatorios', 400));
        }

        const domicilioData: IEmpleadoCreate = {
            nombre,
            apellido,
            correo_electronico,
            activo: 1
        };

        const domicilio = await Empleado.create(domicilioData);
        res.status(201).json(domicilio);
    } catch (error) {
        next(new AppError('Error al crear el domicilio', 500));
    }
}




export const actualizarEmpleado= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : IEmpleadoUpdate = {};


    try {
        if (req.body.hasOwnProperty('nombre')) objetoActualizado.nombre = req.body.nombre
        if (req.body.hasOwnProperty('apellido')) objetoActualizado.apellido = req.body.apellido;
        if (req.body.hasOwnProperty('correo_electronico')) objetoActualizado.correo_electronico = req.body.correo_electronico;
        if (req.body.hasOwnProperty('activo') && (req.body.activo == "0" || req.body.activo == "1")) objetoActualizado.activo = parseInt(req.body.activo, 10) == 1 ? 1 : 0;

        const [actualizado] = await Empleado.update(
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

        const dataModificada = await Empleado.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el empleado', 500));
    }
};



export const eliminarEmpleado = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            return next(new AppError(`Empleado con ID ${id} no encontrado`, 404));
        }
        const empleadoEliminado : IEmpleadoAttributes = await empleado.update({ activo: 0 });
        res.status(204).send(empleadoEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el empleado', 500));
    }
}


