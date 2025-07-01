import AppError from "../utils/appError.js";
import Venta from "../models/venta.models.js";
import {DateTime} from "luxon";
import { Request, Response, NextFunction } from "express";
import { IVentaAttributes, IVentaCreate, IVentaUpdate } from "../types/venta.js";
import { IDatalleBafCreate} from '../types/detalle_baf.js';
import { IDetallePortaCreate} from '../types/detallePorta.js';
import { Op, WhereOptions, Transaction } from "sequelize";
import sequelize from "../config/base_datos.js";
import { getStrategy } from "../services/strategies/venta_manager.strategy.js";
import DetalleBaf from "../models/detalle_baf.models.js";



export const  getVentas = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where : WhereOptions<IVentaAttributes> = {};


        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id =  parseInt(req.query.cliente_id as string);
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; // Convertir a entero
        if (req.query.hasOwnProperty('convergencia')) where.convergencia = req.query.convergencia === '1' ? 1 : 0; // Convertir a entero
        if(req.query.hasOwnProperty('tipo_negocio_id')) where.tipo_negocio_id = parseInt(req.query.tipo_negocio_id as string);


        const venta = await Venta.findAll({
            where: where
        });
        res.status(200).json(venta);
    } catch (error) {
        next(new AppError('Error al obtener las ventas', 500));
    }
}


export const  getVentaPorId = async (req: Request, res: Response, next: NextFunction) => {
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



export const createVenta= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fecha_realizacion = req.body.fecha_realizacion ? DateTime.fromISO(req.body.fecha_realizacion).toJSDate() : new Date();
        
        const ventaData: IVentaCreate = {
            fecha_realizacion: fecha_realizacion,
            comentario_horario_contacto: req.body.comentario_horario_contacto,
            convergencia: req.body.convergencia,
            tipo_negocio_id: req.body.tipo_negocio_id,
            cliente_id: req.body.cliente_id,
            domicilio_id: req.body.domicilio_id
        };

        const venta = await Venta.create(ventaData);
        res.status(201).json(venta);
    } catch (error) {
        next(new AppError('Error al crear venta', 500));
    }
}




export const actualizarVenta= async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : IVentaUpdate = {};


    try {
        if (req.body.hasOwnProperty('convergencia')) objetoActualizado.convergencia = req.body.convergencia === '1' ? 1 : 0; // Convertir a entero
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo == '1' ? 1 : 0; // Convertir a entero
        if (req.body.hasOwnProperty('tipo_negocio_id')) objetoActualizado.tipo_negocio_id = parseInt(req.body.tipo_negocio_id as string);
        if (req.body.hasOwnProperty('comentario_horario_contacto')) objetoActualizado.comentario_horario_contacto = req.body.comentario_horario_contacto
        if (req.body.hasOwnProperty('domicilio_id')) objetoActualizado.domicilio_id = parseInt(req.body.domicilio_id as string);

        const [actualizado] = await Venta.update(
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

        const dataModificada = await Venta.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarVenta = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return next(new AppError(`Venta con ID ${id} no encontrado`, 404));
        }
        const ventaEliminado : IVentaAttributes = await venta.update({ activo: 0 });
        res.status(204).send(ventaEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el Venta', 500));
    }
}

export const crearVentaConDetalles = async ( req: Request, res: Response, next: NextFunction) => {

    const detalles : IDetallePortaCreate | IDatalleBafCreate = req.body.detalles;
    const datosVenta : IVentaCreate = req.body.datosVenta;

    //Calcular fecha hora actual con luxon con Argentina y pasarlo a date, este dato no viene por el body
    const zona = 'America/Argentina/Buenos_Aires';
    const fecha_realizacion = DateTime.now().setZone(zona).toJSDate();

    datosVenta.fecha_realizacion = fecha_realizacion;

    // Iniciamos una transacción controlada por Sequelize
    const t : Transaction = await sequelize.transaction();

    try {
        
        // 1. Crear la Venta principal dentro de la transacción
        const nuevaVenta = await Venta.create(datosVenta, { transaction: t });
        if (!nuevaVenta) {
            throw new AppError('No se pudo crear el registro de venta principal.', 500);
        }


        // Agregamos el venta_id a los detalles
        detalles.venta_id = nuevaVenta.id;
        // 2. Obtener y ejecutar la estrategia correcta dinámicamente
        const strategy = getStrategy(nuevaVenta.tipo_negocio_id);
        await strategy.createDetails(detalles, t); // Se pasa la instancia completa de venta

        const detallesCreados = await strategy.getDetails(nuevaVenta.id, t);

        


        // 3. Confirmar la transacción
        await t.commit();

        res.status(201).json(detallesCreados);

    } catch (error) {
        await t.rollback(); // Si algo falla, revertir todo
        
        // Propagar el error
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(`Error al crear la venta`, 500);
    }
};


