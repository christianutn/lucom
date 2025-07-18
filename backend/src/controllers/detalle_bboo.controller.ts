import DetalleBboo from "../models/detalle_bboo.models.js";
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { IDetalleBbooAttributes, IDetalleBbooCreate, IDetalleBbooUpdate } from "../types/detalle_bboo.js";
import { WhereOptions } from "sequelize";
import { parse } from "path";


export const getDetallesBboo = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { linea_claro_a_consultar, tipos_domicilios_id } = req.query;
        const where: WhereOptions<IDetalleBbooAttributes> = {};

        if (linea_claro_a_consultar) where.linea_claro_a_consultar = parseInt(linea_claro_a_consultar as string, 10);
        if (tipos_domicilios_id) where.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);   
       

        const detalleBboo = await DetalleBboo.findAll({
            where
        });

        res.status(200).json(detalleBboo);

    } catch (error) {
        return next(new AppError('Error al obtener los Detalle de BBOO', 500));
    }
};

export const getDetalleBbooPorID = async (req: Request, res: Response, next: NextFunction) => {
    const { venta_id } = req.params;
    try {
        const detalleBboo = await DetalleBboo.findByPk(venta_id);
        if (!detalleBboo) {
            return next(new AppError(`DetalleBboo con ID ${venta_id} no encontrado`, 404));
        }
        res.status(200).json(detalleBboo);
    } catch (error) {
        return next(new AppError('Error al obtener el DetalleBboo', 500));
    }
};

export const createDetalleBboo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venta_id, linea_claro_a_consultar, pedido_rellamado, tipos_domicilios_id } = req.body;
        const detalle_bboo = await DetalleBboo.create({ venta_id, linea_claro_a_consultar, pedido_rellamado, tipos_domicilios_id });
        res.status(201).json(detalle_bboo);
    } catch (error) {
        return next(new AppError('Error al crear el DetalleBBOO', 500));
    }
};



export const actualizarDetalleBboo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venta_id = parseInt(req.params.venta_id as string, 10);

        const detalleBbooActualizado: IDetalleBbooUpdate = {};
        

        const { linea_claro_a_consultar, pedido_rellamado, tipos_domicilios_id } = req.body;

        // Parsear datos y asignar a objeto de actualización
        if (linea_claro_a_consultar) detalleBbooActualizado.linea_claro_a_consultar = linea_claro_a_consultar as string;
        if (pedido_rellamado) detalleBbooActualizado.pedido_rellamado = pedido_rellamado as string;
        if (tipos_domicilios_id) detalleBbooActualizado.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);

        // validar que se haya enviado al menos un campo para actualizar
        if (Object.keys(detalleBbooActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar DetalleBboo' });
            return;
        }

            
     
        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(detalleBbooActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar DetalleBboo' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await DetalleBboo.update(detalleBbooActualizado, {
            where: { venta_id: venta_id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el DetalleBaf no existe DetalleBboo' });
            return;
        }

        const DetalleBafModificado = await DetalleBboo.findByPk(venta_id);

        res.status(200).json(DetalleBafModificado);
    } catch (error) {
        return next(new AppError('Error al actualizar el DetalleBboo', 500));
    }
};
