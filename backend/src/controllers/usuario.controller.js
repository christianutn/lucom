import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import Usuario from "../models/usuario.models.js";
export const  getUsuarios = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('empleado_id')) where.empleado_id =  req.query.empleado_id;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        if(req.query.hasOwnProperty('rol')) where.rol = req.query.rol


        const usuario = await Usuario.findAll({
            where: where
        });
        res.status(200).json(usuario);
    } catch (error) {
        next(new AppError('Error al obtener los usuarios', 500));
    }
}


export const  getUsuarioPorId = async (req, res, next) => {
    try {

        const usuario = await Usuario.findByPk(req.params.empleado_id);

        if (!usuario) {
            return next(new AppError(`Usuario con ID ${req.params.empleado_id} no encontrado`, 404));
        }
        res.status(200).json(usuario);
    } catch (error) { 
         next(new AppError(`Error al buscar usuario con id: ${req.params.empleado_id}`, 500));
    }
}



export const createUsuario= async (req, res, next) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        next(new AppError('Error al crear usuario', 500));
    }
}




export const actualizarUsuario= async (req, res, next) => {
    const { empleado_id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('rol')) objetoActualizado.rol = req.body.rol
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await Usuario.update(
            objetoActualizado,
            {
                where: {
                    empleado_id: empleado_id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Usuario.findByPk(empleado_id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarUsuario = async(req, res, next) =>{
    try {
        const { empleado_id } = req.params;

        const usuario = await Usuario.findByPk(empleado_id);
        if (!usuario) {
            return next(new AppError(`Tipo de negocio con ID ${empleado_id} no encontrado`, 404));
        }
        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de negocio', 500));
    }
}


