import DetallePorta from "../models/detalle_porta.models.js";
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { IDetallePortaAttributes, IDetallePortaCreate, IDetallePortaUpdate } from "../types/detallePorta.d.js";
import { WhereOptions } from "sequelize";


export const getDetallesPorta = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { venta_id, NIM_a_portar, gigas, compania } = req.query;
        const where: WhereOptions<IDetallePortaAttributes> = {};

        if (venta_id) where.venta_id = parseInt(venta_id as string, 10);
        if (NIM_a_portar) where.NIM_a_portar = NIM_a_portar as string;
        if (gigas) where.gigas = parseInt(gigas as string, 10);
        if (compania) where.compania = parseInt(compania as string, 10);

        const detallePorta = await DetallePorta.findAll({
            where
        });

        res.status(200).json(detallePorta);

    } catch (error) {
        return next(new AppError('Error al obtener los DetalleBafs', 500));
    }
};

export const getDetallePortaPorID = async (req: Request, res: Response, next: NextFunction) => {
    const { venta_id } = req.params;
    try {
        const detalleBaf = await DetallePorta.findByPk(venta_id);
        if (!detalleBaf) {
            return next(new AppError(`DetallePorta con ID ${venta_id} no encontrado`, 404));
        }
        res.status(200).json(detalleBaf);
    } catch (error) {
        return next(new AppError('Error al obtener el DetallePorta', 500));
    }
};

export const createDetallePorta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venta_id, NIM_a_portar, abono_id, gigas, compania } = req.body;
        const detalle_baf = await DetallePorta.create({ venta_id, NIM_a_portar, gigas, compania });
        res.status(201).json(detalle_baf);
    } catch (error) {
        return next(new AppError('Error al crear el DetalleBaf', 500));
    }
};



export const actualizarDetallePorta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venta_id = parseInt(req.params.venta_id as string, 10);

        const detallePortaActualizado: IDetallePortaUpdate = {};

        const { NIM_a_portar, abono_id, gigas, compania } = req.body;

        // Parsear datos y asignar a objeto de actualización
        if (NIM_a_portar) detallePortaActualizado.NIM_a_portar = NIM_a_portar as string;
        if (gigas) detallePortaActualizado.gigas = parseInt(gigas as string, 10);
        if (compania) detallePortaActualizado.compania = parseInt(compania as string, 10);

        // validar que se haya enviado al menos un campo para actualizar
        if (Object.keys(detallePortaActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }

            
     
        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(detallePortaActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await DetallePorta.update(detallePortaActualizado, {
            where: { venta_id: venta_id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el DetalleBaf no existe' });
            return;
        }

        const DetalleBafModificado = await DetallePorta.findByPk(venta_id);

        res.status(200).json(DetalleBafModificado);
    } catch (error) {
        return next(new AppError('Error al actualizar el DetalleBaf', 500));
    }
};
