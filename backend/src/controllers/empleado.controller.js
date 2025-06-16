import Empleado from "../models/empleado.models.js";
import AppError from "../utils/appError.js";
import { Op } from "sequelize";


export const  getEmpleados = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('nombre')) where.nombre =  { [Op.like]: `%${req.query.nombre}%` };;
        if (req.query.hasOwnProperty('apellido')) where.barrio_id = { [Op.like]: `%${req.query.apellido}%` };
        if (req.query.hasOwnProperty('correo_electronico')) where.correo_electronico = { [Op.like]: `%${req.query.correo_electronico}%` };
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo;
        
        const empelado = await Empleado.findAll({
            where: where
        });
        res.status(200).json(empelado);
    } catch (error) {
        next(new AppError('Error al obtener los empleados', 500));
    }
}


export const  getEmpleadosPorId = async (req, res, next) => {
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



export const createEmpleado= async (req, res) => {
    try {
        const domicilio = await Empleado.create(req.body);
        res.status(201).json(domicilio);
    } catch (error) {
        next(new AppError('Error al crear el domicilio', 500));
    }
}




export const actualizarEmpleado= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('nombre')) objetoActualizado.nombre = req.body.nombre
        if (req.body.hasOwnProperty('apellido')) objetoActualizado.apellido = req.body.apellido;
        if (req.body.hasOwnProperty('correo_electronico')) objetoActualizado.correo_electronico = req.body.correo_electronico;
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await Empleado.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Empleado.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el empleado', 500));
    }
};



export const eliminarEmpleado = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            return next(new AppError(`Empleado con ID ${id} no encontrado`, 404));
        }
        await empleado.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el empleado', 500));
    }
}


