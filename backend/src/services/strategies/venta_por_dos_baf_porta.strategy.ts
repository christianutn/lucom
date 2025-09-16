// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import { IStrategyDetalleVenta } from './IStrategyDetalleVenta.js';
import AppError from '../../utils/appError.js';

// Importamos models
import DetalleBaf from '../../models/detalle_baf.models.js';
import DetallePorta from '../../models/detalle_porta.models.js';

//Importamos interfaces
import { IDatalleBafCreate } from '../../types/detalle_baf.js'
import { IDomicilioAttributes } from '../../types/domicilio.js';
import { IBarrioAttributes } from '../../types/barrio.js';
import { IVentaAttributes } from '../../types/venta.js';
import { IClienteAttributes } from '../../types/cliente.js';
import { IDetallePortaCreate, IDetallePortaParametro } from '../../types/detallePorta.js';
import { IDetalleBafPortaCreate } from "../../types/detalle_baf_con_porta.js"

//Importamos strategy porta y baf
import PortaStrategy from './venta_porta.strategy.js';
import BafStrategy from './venta_baf.strategy.js';

class BafConPortaStrategy implements IStrategyDetalleVenta {

    public async createDetails(detalles: IDetalleBafPortaCreate, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para BAF son requeridos.', 400);
        }

        // Creamos Baf
        const detalleBafACrear: IDatalleBafCreate = {
            venta_id: detalles.venta_id,
            tipos_domicilios_id: detalles.tipos_domicilios_id,
            abono_id: detalles.abono_id,
            TVHD: detalles.TVHD,
            cantidad_decos: detalles.cantidad_decos,
            horario_contacto: detalles.horario_contacto,
            tipo_convergencia_id: detalles.tipo_convergencia_id,
        }

        await DetalleBaf.create({
            ...detalleBafACrear
        }, { transaction });

        // Creamos Porta
        for (const nim of detalles.portabilidades) {
            const detallePortaACrear: IDetallePortaCreate = {
                venta_id: detalles.venta_id,
                NIM_a_portar: nim.nimAPortar,
                gigas: nim.gigasId,
                compania: nim.companiaId
            }
            await DetallePorta.create({
                ...detallePortaACrear
            }, { transaction });
        }



    }


    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        const detalleBaf = await DetalleBaf.findByPk(venta_id, { transaction });
        const detallePorta = await DetallePorta.findByPk(venta_id, { transaction });

        const bafData = detalleBaf ? detalleBaf.get({ plain: true }) : {};
        const portaData = detallePorta ? detallePorta.get({ plain: true }) : {};

        return { ...portaData, ...bafData };
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),
            body('detalles.tipos_domicilios_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El tipos_domicilios_id debe ser un número entero positivo'),
            body('detalles.abono_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El abono_id debe ser un número entero positivo'),
            body('detalles.TVHD')
                .exists()
                .trim()
                .isIn([0, 1])
                .withMessage('El tvhd debe ser un 1 o 0'),
            body('detalles.cantidad_decos')
                .exists()
                .trim()
                .isInt({ min: 0 })
                .withMessage('El cantidad_decos debe ser un número entero positivo'),
            body('detalles.tipo_convergencia_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El tipo_convergencia_id debe ser un número entero positivo'),
            body('detalles.horario_contacto')
                .optional({ checkFalsy: true })
                .isString()
                .trim()
                .isLength({ min: 0, max: 150 })
                .withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
            body('detalles.portabilidades')
                .isArray({ min: 1 })
                .withMessage('Debe ser un array con al menos un NIM'),
            body('detalles.*.nimAPortar')
                .isString().withMessage('Cada NIM debe ser un string')
                .isLength({ min: 1, max: 15 }).withMessage('Cada NIM debe tener entre 1 y 15 caracteres')
                .customSanitizer(value => value.trim()),
            body('detalles.*.gigasId')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de gigas debe ser un número entero positivo'),
            body('detalles.*.companiaId')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de compania debe ser un número entero positivo')
        ]
    }

    public async cargar_nueva_fila(venta: IVentaAttributes, detalles: IDetalleBafPortaCreate, cliente: IClienteAttributes, domicilio: IDomicilioAttributes, barrio: IBarrioAttributes): Promise<any> {
        try {

            const portaStrategy = new PortaStrategy();
            const bafStrategy = new BafStrategy();

            // Modificamos tipo_negocio_id de venta para porta y baf
            // Ejecutamos la carga de fila para ambas partes de la venta
            venta.tipo_negocio_id = 1

            if (Array.isArray(detalles.portabilidades)) {

                await portaStrategy.cargar_nueva_fila(venta, detalles.portabilidades, cliente, domicilio, barrio);

            }

            venta.tipo_negocio_id = 2

            if ("abono_id" in detalles) {
                await bafStrategy.cargar_nueva_fila(venta, {
                    venta_id: detalles.venta_id,
                    tipos_domicilios_id: detalles.tipos_domicilios_id,
                    abono_id: detalles.abono_id,
                    TVHD: detalles.TVHD,
                    cantidad_decos: detalles.cantidad_decos,
                    horario_contacto: detalles.horario_contacto,
                    tipo_convergencia_id: detalles.tipo_convergencia_id,
                }, cliente, domicilio, barrio);
            }

        } catch (error) {
            throw new AppError('Error al cargar la nueva fila', 500);
        }
    }
}

export default BafConPortaStrategy;