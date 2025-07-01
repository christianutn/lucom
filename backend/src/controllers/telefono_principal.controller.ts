import AppError from "../utils/appError.js";
import { Op, WhereOptions } from "sequelize";
import TelefonoPrincipal from "../models/telefono_principal.models.js";
import { DateTime } from "luxon";
import { Request, Response, NextFunction } from "express";
import { ITelefonoPrincipalAttributes, ITelefonoPrincipalCreate, ITelefonoPrincipalUpdate } from "../types/telefono_principal.d.js";
export const  getTelefonosPrincipales = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<ITelefonoPrincipalAttributes> = {};


        if (req.query.hasOwnProperty('numero_telefono')) where.numero_telefono =  { [Op.like]: `%${req.query.numero_telefono}%` };;
        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id = req.query.cliente_id as string; 
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0;

        const tel = await TelefonoPrincipal.findAll({
            where: where
        });
        res.status(200).json(tel);
    } catch (error) {
        next(new AppError('Error al obtener los teléfonos principales', 500));
    }
}


export const  getTelefonoPrincipalPorID = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tel = await TelefonoPrincipal.findByPk(req.params.id);

        if (!tel) {
            return next(new AppError(`Roles con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tel);
    } catch (error) {
        next(new AppError(`Error al buscar Roless con id: ${req.params.id}`, 500));
    }
}



export const CreateTelefonoPrincipal= async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const fecha_modificacion = DateTime.now().setZone('America/Argentina/Buenos_Aires');

        const telData: ITelefonoPrincipalCreate = {
            numero_telefono: req.body.numero_telefono,
            cliente_id: req.body.cliente_id,
            fecha_modificacion: fecha_modificacion.toJSDate(),
        }
        const tel = await TelefonoPrincipal.create(telData);

        res.status(201).json(tel);
    } catch (error) {
        return next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarTelefonoPrincipal= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : ITelefonoPrincipalUpdate = {
        fecha_modificacion: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
    };
   


    try {
        if (req.body.hasOwnProperty('numero_telefono')) objetoActualizado.numero_telefono = req.body.numero_telefono
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo
        if (req.body.hasOwnProperty('cliente_id')) objetoActualizado.cliente_id = req.body.cliente_id
        if (req.body.hasOwnProperty('fecha_modificacion')) objetoActualizado.fecha_modificacion = req.body.codfecha_modificacionigo

        const [actualizado] = await TelefonoPrincipal.update(
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

        const dataModificada = await TelefonoPrincipal.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el rol', 500));
    }
};



export const eliminarTelefonoPrincipal = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const tel = await TelefonoPrincipal.findByPk(id);
        if (!tel) {
            return next(new AppError(`Telefono Principal con ID ${id} no encontrado`, 404));
        }
        const telEliminado : ITelefonoPrincipalAttributes = await tel.update({ activo: 0 });
        res.status(204).send(telEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el telefono principal', 500));
    }
}


