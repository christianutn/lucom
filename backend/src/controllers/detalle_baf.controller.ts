// controller/detalle_baf.controller.js

import DetalleBaf from "../models/detalle_baf.models.js";
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { Op, WhereOptions } from "sequelize";
import { IDatalleBafAttributes, IDatalleBafCreate, IDatalleBafUpdate } from "../types/detalle_baf.d.js";
import Venta from "../models/venta.models.js";
import Cliente from "../models/cliente.models.js";
import Domicilio from "../models/domicilio.models.js";
import Barrio from "../models/barrio.models.js";
import Empleado from "../models/empleado.models.js";
import TipoDocumento from "../models/tipo_documento.models.js";
import TelefonoPrincipal from "../models/telefono_principal.models.js";
import Abono from "../models/abono.models.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import TipoConvergencia from "../models/tipo_convergencia.models.js";
export const getDetallesBaf = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { venta_id, tipos_domicilios_id, abono_id, TVHD, cantidad_decos, horario_contacto, tipo_convergencia_id } = req.query;
        const where: WhereOptions<IDatalleBafAttributes> = {};

        if (tipos_domicilios_id) where.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);
        if (abono_id) where.abono_id = parseInt(abono_id as string, 10);
        if (TVHD !== undefined) where.TVHD = parseInt(TVHD as string, 10) as 0 | 1;
        if (cantidad_decos) where.cantidad_decos = parseInt(cantidad_decos as string, 10);
        if (horario_contacto) where.horario_contacto = horario_contacto as string;
        if (tipo_convergencia_id) where.tipo_convergencia_id = parseInt(tipo_convergencia_id as string, 10);
        const detalleBaf = await DetalleBaf.findAll({
            where,
            include: [
                {
                    model: Venta,
                    as: 'venta',
                    include: [
                        {
                            model: Cliente,
                            as: 'cliente'
                        },
                        {
                            model: Domicilio,
                            as: 'domicilio',
                            include: [
                                {
                                    model: Barrio,
                                    as: 'barrio'
                                }
                            ]
                        },
                        {
                            model: Empleado,
                            as: 'empleado'
                        },
                        {
                            model: Cliente,
                            as: 'cliente',
                            include: [
                                {
                                    model: TipoDocumento,
                                    as: 'tipoDocumento'
                                    
                                },
                                {
                                    model: TelefonoPrincipal,
                                    as: 'telefonosPrincipales'
                                }
                            ]
                        }
                        
                    ]
                },
                {
                    model: Abono,
                    as: 'abono'
                },
                {
                    model: TipoDomicilio,
                    as: 'tipoDomicilio'
                },
                {
                    model: TipoConvergencia,
                    as: 'tipoConvergencia'
                }
                
                
            ]
        });

        res.status(200).json(detalleBaf);

    } catch (error) {
        return next(new AppError('Error al obtener los DetalleBafs', 500));
    }
};

export const getDetallesBafPorID = async (req: Request, res: Response, next: NextFunction) => {
    const { venta_id } = req.params;
    try {
        const detalleBaf = await DetalleBaf.findByPk(venta_id);
        if (!detalleBaf) {
            return next(new AppError(`DetalleBaf con ID ${venta_id} no encontrado`, 404));
        }
        res.status(200).json(detalleBaf);
    } catch (error) {
        return next(new AppError('Error al obtener el DetalleBaf', 500));
    }
};

export const createDetalleBaf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venta_id, tipos_domicilios_id, abono_id, TVHD, cantidad_decos, horario_contacto, tipo_convergencia_id  } = req.body;

        

        const nuevaVenta : IDatalleBafCreate = {
            venta_id,
            tipos_domicilios_id,
            abono_id,
            TVHD,
            cantidad_decos,
            horario_contacto,
            tipo_convergencia_id
        }

        const detalle_baf = await DetalleBaf.create(nuevaVenta);
        res.status(201).json(detalle_baf);
    } catch (error) {
        return next(new AppError('Error al crear el DetalleBaf', 500));
    }
};


export const actualizarDetalleBaf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venta_id = parseInt(req.params.venta_id as string, 10);

        const detalleBafActualizado: IDatalleBafUpdate = {};

        const { tipos_domicilios_id, abono_id, TVHD, cantidad_decos, horario_contacto, tipo_convergencia_id } = req.body;

        if (tipos_domicilios_id) detalleBafActualizado.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);
        if (abono_id) detalleBafActualizado.abono_id = parseInt(abono_id as string, 10);
        if (TVHD !== undefined) detalleBafActualizado.TVHD = parseInt(TVHD as string, 10) as 0 | 1;
        if (cantidad_decos) detalleBafActualizado.cantidad_decos = parseInt(cantidad_decos as string, 10);
        if (horario_contacto) detalleBafActualizado.horario_contacto = horario_contacto as string;
        if (tipo_convergencia_id) detalleBafActualizado.tipo_convergencia_id = parseInt(tipo_convergencia_id as string, 10);

            
     
        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(detalleBafActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await DetalleBaf.update(detalleBafActualizado, {
            where: { venta_id: venta_id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el DetalleBaf no existe' });
            return;
        }

        const DetalleBafModificado = await DetalleBaf.findByPk(venta_id);

        res.status(200).json(DetalleBafModificado);
    } catch (error) {
        return next(new AppError('Error al actualizar el DetalleBaf', 500));
    }
};
