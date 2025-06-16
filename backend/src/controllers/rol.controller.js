import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import Rol from "../models/rol.models.js";
export const  getRoles = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        if (req.query.hasOwnProperty('codigo')) where.id = req.query.codigo;

        const rol = await Rol.findAll({
            where: where
        });
        res.status(200).json(rol);
    } catch (error) {
        next(new AppError('Error al obtener los Roles', 500));
    }
}


export const  getRolesPorId = async (req, res, next) => {
    try {

        const rol = await Rol.findByPk(req.params.codigo);

        if (!rol) {
            return next(new AppError(`Roles con ID ${req.params.codigo} no encontrado`, 404));
        }
        res.status(200).json(rol);
    } catch (error) {
        next(new AppError(`Error al buscar Roless con id: ${req.params.codigo}`, 500));
    }
}



export const createRol= async (req, res, next) => {
    try {
        const rol = await Rol.create(req.body);
        res.status(201).json(rol);
    } catch (error) {
        next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarRol= async (req, res, next) => {
    const { codigo } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await Rol.update(
            objetoActualizado,
            {
                where: {
                    codigo: codigo
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Rol.findByPk(codigo);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el rol', 500));
    }
};



export const eliminarRol = async(req, res, next) =>{
    try {
        const { codigo } = req.params;

        const rol = await Rol.findByPk(codigo);
        if (!rol) {
            return next(new AppError(`Rol con ID ${id} no encontrado`, 404));
        }
        await rol.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


