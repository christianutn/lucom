import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import TelefonoPrincipal from "../models/telefono_principal.models.js";
import { DateTime } from "luxon";
export const  getTelefonosPrincipales = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('numero_telefono')) where.numero_telefono =  { [Op.like]: `%${req.query.numero_telefono}%` };;
        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id = req.query.cliente_id; 
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo;

        const tel = await TelefonoPrincipal.findAll({
            where: where
        });
        res.status(200).json(tel);
    } catch (error) {
        next(new AppError('Error al obtener los teléfonos principales', 500));
    }
}


export const  getTelefonoPrincipalPorID = async (req, res, next) => {
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



export const CreateTelefonoPrincipal= async (req, res, next) => {
    try {
        const fecha_modificacion = DateTime.now().setZone('America/Argentina/Buenos_Aires');
        req.body.fecha_modificacion = fecha_modificacion;
        const tel = await TelefonoPrincipal.create(req.body);
        res.status(201).json(tel);
    } catch (error) {
        next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarTelefonoPrincipal= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};
    const fecha_modificacion = DateTime.now().setZone('America/Argentina/Buenos_Aires');
    objetoActualizado.fecha_modificacion = fecha_modificacion;


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
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await TelefonoPrincipal.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el rol', 500));
    }
};



export const eliminarTelefonoPrincipal = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const tel = await TelefonoPrincipal.findByPk(id);
        if (!tel) {
            return next(new AppError(`Rol con ID ${id} no encontrado`, 404));
        }
        await tel.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el telefono principal', 500));
    }
}


