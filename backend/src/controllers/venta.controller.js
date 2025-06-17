import AppError from "../utils/appError.js";
import Venta from "../models/venta.models.js";
import {DateTime} from "luxon";
export const  getVentas = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id =  req.query.cliente_id;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        if (req.query.hasOwnProperty('convergencia')) where.convergencia = req.query.convergencia; 
        if(req.query.hasOwnProperty('tipo_negocio_id')) where.tipo_negocio_id = req.query.tipo_negocio_id


        const venta = await Venta.findAll({
            where: where
        });
        res.status(200).json(venta);
    } catch (error) {
        next(new AppError('Error al obtener las ventas', 500));
    }
}


export const  getVentaPorId = async (req, res, next) => {
    try {

        const venta = await Venta.findByPk(req.params.id);

        if (!venta) {
            return next(new AppError(`Venta con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(venta);
    } catch (error) { 
         next(new AppError(`Error al buscar ventas con id: ${req.params.id}`, 500));
    }
}



export const createVenta= async (req, res, next) => {
    try {
        const fecha_realizacion = DateTime.now().setZone('America/Argentina/Buenos_Aires').toISODate();
        req.body.fecha_realizacion = fecha_realizacion;
        const venta = await Venta.create(req.body);
        res.status(201).json(venta);
    } catch (error) {
        next(new AppError('Error al crear venta', 500));
    }
}




export const actualizarVenta= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('convergencia')) objetoActualizado.convergencia = req.body.convergencia
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo
        if (req.body.hasOwnProperty('tipo_negocio_id')) objetoActualizado.tipo_negocio_id = req.body.tipo_negocio_id
        if (req.body.hasOwnProperty('comentario_horario_contacto')) objetoActualizado.comentario_horario_contacto = req.body.comentario_horario_contacto

        const [actualizado] = await Venta.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Venta.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarVenta = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return next(new AppError(`Venta con ID ${id} no encontrado`, 404));
        }
        await venta.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el Venta', 500));
    }
}


