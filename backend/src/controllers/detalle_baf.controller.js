// controller/detalle_baf.controller.js

import Detalle_Baf from "../models/detalle_baf.models.js";
import Abono from "../models/abono.models.js";
import Venta from "../models/venta.models.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import TipoConvergencia from "../models/tipo_convergencia.models.js";
import TipoNegocio from "../models/tipo_negocio.models.js";
import Cliente from "../models/cliente.models.js";
import AppError from "../utils/appError.js";


export const getDetallesBaf = async (req, res, next) => {

    const where = {};

    if(req.query.hasOwnProperty('venta_id')) where.venta_id = req.query.venta_id;
    if(req.query.hasOwnProperty('abono_id')) where.abono_id = req.query.abono_id;
    if(req.query.hasOwnProperty('tipos_domicilio_id')) where.tipos_domicilios_id = req.query.tipos_domicilio_id;
    if(req.query.hasOwnProperty('tvhd')) where.TVHD = req.query.tvhd;
    if(req.query.hasOwnProperty('cantidad_decos')) where.cantidad_decos = req.query.cantidad_decos;
    if(req.query.hasOwnProperty('tipo_convergencia')) where.tipo_convergencia = req.query.tipo_convergencia;
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
                    attributes: [
                        'id',
                        'comentario_horario_contacto',
                        'convergencia',
                        'tipo_negocio_id',
                        'fecha_realizacion',
                        'activo',
                        'numero_documento_cliente',
                        'tipo_documento_cliente'
                    ],
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
                        tipo_documento: detalle.venta.tipo_documento_cliente,
                        numero_documento: detalle.venta.numero_documento_cliente
                    },
                    attributes: ['tipo_documento', 'numero_documento', 'nombre', 'apellido']
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


