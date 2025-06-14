import DetallePorta from "../models/detalle_porta.models.js";
import Giga from "../models/giga.models.js";
import Compania from "../models/compania.models.js";
import Venta from "../models/venta.models.js";
import AppError from "../utils/appError.js";




export const getDetallesPorta = async (req, res, next) => {
    try {

        const where = {};

        if (req.query.hasOwnProperty('venta_id')) where.venta_id = req.query.venta_id;
        if (req.query.hasOwnProperty('NIM_a_portar')) where.NIM_a_portar = req.query.NIM_a_portar;
        if (req.query.hasOwnProperty('gigas')) where.gigas = req.query.gigas;
        if (req.query.hasOwnProperty('compania')) where.compania = req.query.compania;

        const detallesPorta = await DetallePorta.findAll(
            {
                include: [
                    {
                        model: Venta,
                        as: "venta",
                        attributes: [
                            "id",
                            "comentario_horario_contacto",
                            "convergencia",
                            "tipo_negocio_id",
                            "fecha_realizacion",
                            "activo",
                            "numero_documento_cliente",
                            "tipo_documento_cliente"
                        ]
                    },
                    {
                        model: Giga,
                        as: "giga",
                    },
                    {
                        model: Compania,
                        as: "companiaAsociada",
                    },
                ],
                where

            }
        );

        if (detallesPorta.length === 0) {
            return res.status(200).json({ message: "No se encontraron detalles de porta" });
        }
        res.status(200).json(detallesPorta);
    } catch (error) {
        next(error);
    }
};

export const createDetallePorta = async (req, res, next) => {
    try {
        const detallePorta = await DetallePorta.create(req.body);
        res.status(201).json(detallePorta);
    } catch (error) {
        next(error);
    }
};

export const actualizarDetallePorta = async (req, res, next) => {
    const { venta_id } = req.params;

    const detalleActualizado = {};


    try {
        if (req.body.hasOwnProperty('NIM_a_portar')) detalleActualizado.NIM_a_portar = req.body.NIM_a_portar
        if (req.body.hasOwnProperty('gigas')) detalleActualizado.gigas = req.body.gigas;
        if (req.body.hasOwnProperty('compania')) detalleActualizado.compania = req.body.compania;

        const [actualizado] = await DetallePorta.update(
            detalleActualizado,
            {
                where: {
                    venta_id: venta_id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await DetallePorta.findByPk(venta_id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(error);
    }
};


export const eliminarDetallePorta = async (req, res, next) => {
    const { venta_id } = req.params;
    try {
        const detallePorta = await DetallePorta.findByPk(venta_id);
        if (!detallePorta) {
            return next(new AppError(`Detalle porta con ID ${venta_id} no encontrado`, 404));
        }
        await detallePorta.destroy();
        res.status(204).send({message: 'Detalle porta eliminado'});
    } catch (error) {
        next(new AppError('Error al eliminar el detalle porta', 500));
    }
};