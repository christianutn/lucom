import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import Usuario from "../models/usuario.models.js";
import { Request, Response, NextFunction } from "express";
import { IUsuarioAttributes, IUsuarioCreate, IUsuarioUpdate } from "../types/usuario.js"
import {createHash} from "../utils/bcrypt.js";
export const  getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IUsuarioAttributes> = {};


        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0;
        if(req.query.hasOwnProperty('rol')) where.rol = req.query.rol as string;

        const usuario = await Usuario.findAll({
            where: where
        });
        res.status(200).json(usuario);
    } catch (error) {
        return next(new AppError('Error al obtener los usuarios', 500));
    }
}


export const  getUsuarioPorId = async (req: Request, res: Response, next: NextFunction) => {
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



export const createUsuario= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioData: IUsuarioCreate = {
            empleado_id: req.body.empleado_id,
            rol: req.body.rol,
            contrasena: createHash(req.body.contrasena), // Asegúrate de hashear la contraseña
        }
        const usuario = await Usuario.create(usuarioData);
        res.status(201).json(usuario);
    } catch (error) {
        next(new AppError('Error al crear usuario', 500));
    }
}




export const actualizarUsuario= async (req: Request, res: Response, next: NextFunction) => {
    const { empleado_id } = req.params;

    const objetoActualizado : IUsuarioUpdate = {};


    try {
        if (req.body.hasOwnProperty('rol')) objetoActualizado.rol = req.body.rol;
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await Usuario.update(
            objetoActualizado,
            {
                where: {
                    empleado_id: empleado_id
                }
            });

        if (actualizado == 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }

        const dataModificada = await Usuario.findByPk(empleado_id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarUsuario = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { empleado_id } = req.params;

        const usuario = await Usuario.findByPk(empleado_id);
        if (!usuario) {
            return next(new AppError(`Tipo de negocio con ID ${empleado_id} no encontrado`, 404));
        }
        const usuarioEliminado : IUsuarioAttributes = await usuario.update({ activo: 0 });
        res.status(204).send(usuarioEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de negocio', 500));
    }
}


