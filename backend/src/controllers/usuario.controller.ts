import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import Usuario from "../models/usuario.models.js";
import { Request, Response, NextFunction } from "express";
import { IUsuarioAttributes, IUsuarioCreate, IUsuarioUpdate } from "../types/usuario.js"
import { IEmpleadoAttributes, IEmpleadoCreate, IEmpleadoUpdate } from "../types/empleado.js";
import { createHash } from "../utils/bcrypt.js";
import Empleado from "../models/empleado.models.js";
import sequelize from "../config/base_datos.js";
export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where: WhereOptions<IUsuarioAttributes> = {};


        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0;
        if (req.query.hasOwnProperty('rol')) where.rol = req.query.rol as string;

        const usuario = await Usuario.findAll({
            where: where,
            include: [{
                model: Empleado,
                as: 'empleado'
            }],

        });
        res.status(200).json(usuario);
    } catch (error) {
        return next(new AppError('Error al obtener los usuarios', 500));
    }
}


export const getUsuarioPorId = async (req: Request, res: Response, next: NextFunction) => {
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



export const createUsuario = async (req: Request, res: Response, next: NextFunction) => {

    const t = await sequelize.transaction();
    try {

        

        const empleadoData: IEmpleadoCreate = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo_electronico: req.body.correo_electronico,
            activo: 1,
            alias: req.body.alias
        };

        const empleadoCreado = await Empleado.create(empleadoData, { transaction: t });

        const usuarioData: IUsuarioCreate = {
            empleado_id: empleadoCreado.id,
            rol: req.body.rol,
            contrasena: createHash(req.body.contrasena), // Asegúrate de hashear la contraseña
            activo: req.body.activo ? 1 : 0
        }

        const usuario = await Usuario.create(usuarioData, { transaction: t });


        await t.commit();

        res.status(201).json(usuario);

    } catch (error) {
        await t.rollback();
        next(new AppError('Error al crear usuario', 500));
    }
}




export const actualizarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const { empleado_id } = req.params;

    const updateUsuario: IUsuarioUpdate = {
        rol: req.body.rol,
        activo: req.body.activo
    };

    if (req.body.isNuevaContrasena == 1) {
        updateUsuario.contrasena = createHash(req.body.nuevaContrasena);
    }

    const updateEmpleado: IEmpleadoUpdate = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo_electronico: req.body.correo_electronico,
        alias: req.body.alias
    };

    const t = await sequelize.transaction();

    try {

        await Empleado.update(updateEmpleado, {
            where: {
                id: empleado_id
            },
            transaction: t
        });
        await Usuario.update(
            updateUsuario,
            {
                where: {
                    empleado_id: empleado_id
                },
                transaction: t
            });

        await t.commit();

        const dataModificada = await Usuario.findByPk(empleado_id, {
            include: [{ model: Empleado, as: 'empleado' }]
        });

        res.status(200).json(dataModificada);
    } catch (error) {
        await t.rollback();
        return next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { empleado_id } = req.params;

        const usuario = await Usuario.findByPk(empleado_id);
        if (!usuario) {
            return next(new AppError(`Tipo de negocio con ID ${empleado_id} no encontrado`, 404));
        }
        await usuario.update({ activo: 0 });
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de negocio', 500));
    }
}


export const getMiUsuario  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const usuario = await Usuario.findByPk(req.user?.empleado_id)
        const empleado = await Empleado.findByPk(req.user?.empleado_id)
        
        if (!usuario) throw new AppError('Usuario no encontrado', 404);
        if (!empleado) throw new AppError('Empleado no encontrado', 404);

        const data = {
            empleado_id: empleado.id,
            rol: usuario.rol,
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            correo_electronico: empleado.correo_electronico
        }

        res.status(200).json(data);
    } catch (error) {
        next(new AppError('Error al obtener el usuario', 500));
    }
}