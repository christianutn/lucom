// controller/detalle_baf.controller.js

import Detalle_Baf from "../models/detalle_baf.models.js";
import Abono from "../models/abono.models.js";
import Venta from "../models/venta.models.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import TipoConvergencia from "../models/tipo_convergencia.models.js";
import TipoNegocio from "../models/tipo_negocio.models.js";
import Domicilio from "../models/domicilio.models.js";
import Cliente from "../models/cliente.models.js";
import AppError from "../utils/appError.js";
import { agregarFilaPorNombreColumnas } from '../googleSheets/cargarDatosBAF.js';
import { DateTime } from 'luxon';

export const getDetallesBaf = async (req, res, next) => {

    const where = {};

    if (req.query.hasOwnProperty('venta_id')) where.venta_id = req.query.venta_id;
    if (req.query.hasOwnProperty('abono_id')) where.abono_id = req.query.abono_id;
    if (req.query.hasOwnProperty('tipos_domicilio_id')) where.tipos_domicilios_id = req.query.tipos_domicilio_id;
    if (req.query.hasOwnProperty('tvhd')) where.TVHD = req.query.tvhd;
    if (req.query.hasOwnProperty('cantidad_decos')) where.cantidad_decos = req.query.cantidad_decos;
    if (req.query.hasOwnProperty('tipo_convergencia_id')) where.tipo_convergencia = req.query.tipo_convergencia;
    try {
        const detallesBaf = await Detalle_Baf.findAll({
            include: [
                {
                    model: Abono,
                    as: 'abono'
                },
                {
                    model: Venta,
                    as: 'venta',
                    include: [
                        {
                            model: TipoNegocio,
                            as: 'tipoNegocio'
                        }
                        // Remover Cliente de aquí temporalmente
                    ]
                },
                {
                    model: TipoDomicilio,
                    as: 'tipoDomicilio'
                },
                {
                    model: TipoConvergencia,
                    as: 'tipoConvergencia'
                }
            ],
            where: where
        });

        // Obtener clientes por separado y combinar los datos
        for (let detalle of detallesBaf) {
            if (detalle.venta) {
                const cliente = await Cliente.findOne({
                    where: {
                        id: detalle.venta.cliente_id
                    },
                });
                detalle.venta.dataValues.cliente = cliente;
            }
        }

        if (detallesBaf.length === 0) {
            return next(new AppError('No se encontraron detalles de BAF', 404));
        }

        res.status(200).json(detallesBaf);
    } catch (error) {
        next(new AppError('No se encontraron detalles de BAF', 404));
    }
};


export const createDetalleBaf = async (req, res, next) => {
    try {

        const nombre = req.user.user.nombre;
        const apellido = req.user.user.apellido;

        // Fecha hora actual de argentina
        const fechaHoraActual = DateTime.now().setZone('America/Argentina/Buenos_Aires').toFormat('yyyy-MM-dd HH:mm:ss');

        // String con nombre, apellido y fecha hora
        const responsable = `${nombre} ${apellido} - ${fechaHoraActual}`;

        const detalleBaf = await Detalle_Baf.create(req.body);

        // Consultar detalle baf creado
        const detalleBafCreado = await Detalle_Baf.findByPk(detalleBaf.venta_id, {
            include: [
                {
                    model: Abono,
                    as: 'abono'
                },
                {
                    model: Venta,
                    as: 'venta',
                    include: [
                        {
                            model: TipoNegocio,
                            as: 'tipoNegocio'
                        },
                        {
                            model: Cliente,
                            as: 'cliente'
                        },
                        {
                            model: Domicilio,
                            as: 'domicilio'
                        }
                    ]
                },
                {
                    model: TipoDomicilio,
                    as: 'tipoDomicilio'
                },
                {
                    model: TipoConvergencia,
                    as: 'tipoConvergencia'
                }


            ],
        });

        const dataObject = {
            "Marca temporal": responsable || '',
            "DNI (solo numeros, sin puntos. Si es CUIT anteponer CUIT al número)": detalleBafCreado.venta.cliente.dni || '',
            "Apellido y Nombre": `${detalleBafCreado.venta.cliente.apellido} ${detalleBafCreado.venta.cliente.nombre}` || '',

        }

        res.status(201).json(detalleBafCreado);
    } catch (error) {
        next(new AppError('Error al crear detalle de BAF', 500));
    }
};

export const actualizarDetalleBaf = async (req, res, next) => {
    const { venta_id } = req.params;

    const detalleActualizado = {};


    try {
        if (req.query.hasOwnProperty('venta_id')) where.venta_id = req.query.venta_id;
        if (req.body.hasOwnProperty('tipos_domicilio_id')) detalleActualizado.tipos_domicilio_id = req.body.tipos_domicilio_id
        if (req.body.hasOwnProperty('abono_id')) detalleActualizado.abono_id = req.body.abono_id;
        if (req.body.hasOwnProperty('tvhd')) detalleActualizado.tvhd = req.body.tvhd;
        if (req.body.hasOwnProperty('cantidad_decos')) detalleActualizado.cantidad_decos = req.body.cantidad_decos;
        if (req.body.hasOwnProperty('tipo_convergencia')) detalleActualizado.tipo_convergencia = req.body.tipo_convergencia;
        if (req.body.hasOwnProperty('horario_contacto')) detalleActualizado.horario_contacto = req.body.horario_contacto;

        const [actualizado] = await Detalle_Baf.update(
            detalleActualizado,
            {
                where: {
                    venta_id: venta_id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Detalle_Baf.findByPk(venta_id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el detalle BAF', 500));
    }
};



export const eliminarDetalleBaf = async (req, res, next) => {
    const { venta_id } = req.params;
    try {
        const detalleBaf = await Detalle_Baf.findByPk(venta_id);
        if (!detalleBaf) {
            return next(new AppError(`Detalle BAF con ID ${venta_id} no encontrado`, 404));
        }
        await detalleBaf.destroy();
        res.status(204).send({ message: 'Detalle BAF eliminado' });
    } catch (error) {
        next(new AppError('Error al eliminar el detalle BAF', 500));
    }
};