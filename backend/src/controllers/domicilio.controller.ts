import Domicilio from "../models/domicilio.models.js";
import AppError from "../utils/appError.js";
import Cliente from "../models/cliente.models.js";
import Barrio from "../models/barrio.models.js";
import { Request, Response, NextFunction } from "express";
import { WhereOptions, Op } from "sequelize";
import { IDomicilioAttributes, IDomicilioCreate, IDomicilioUpdate } from "../types/domicilio.d.js";

export const getDomicilios = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where: WhereOptions<IDomicilioAttributes> = {};


        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id = parseInt(req.query.cliente_id as string, 10);
        if (req.query.hasOwnProperty('barrio_id')) where.barrio_id = parseInt(req.query.barrio_id as string, 10);
        if (req.query.hasOwnProperty('nombre_calle')) where.nombre_calle = { [Op.like]: `%${req.query.nombre_calle as string}%` };
        if (req.query.hasOwnProperty('numero_calle')) where.numero_calle = req.query.numero_calle as string;


        const domicilios = await Domicilio.findAll({
            include: [
                {
                    model: Cliente,
                    as: 'cliente'

                },
                {
                    model: Barrio,
                    as: 'barrio'
                }
            ],
            where: where
        });
        res.status(200).json(domicilios);
    } catch (error) {
        next(new AppError('Error al obtener los domicilios', 500));
    }
}


export const createDomicilio = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { cliente_id, nombre_calle, numero_calle, entre_calle_1, entre_calle_2, barrio_id, piso, departamento } = req.body;


        if ([cliente_id, nombre_calle, numero_calle, barrio_id].some(field => field === undefined)) return next(new AppError('Los campos cliente_id, nombre_calle, numero_calle y barrio_id son obligatorios', 400));

        const domicilioData: IDomicilioCreate = {
            cliente_id : parseInt(cliente_id as string, 10),
            nombre_calle : nombre_calle as string,
            numero_calle : numero_calle as string,
            barrio_id : parseInt(barrio_id as string, 10)
        };

        if (entre_calle_1) domicilioData.entre_calle_1 = entre_calle_1 as string;
        if (entre_calle_2) domicilioData.entre_calle_2 = entre_calle_2 as string;
        if (piso) domicilioData.piso = parseInt(piso as string, 10);
        if (departamento) domicilioData.departamento = departamento as string;

        const domicilio = await Domicilio.create(domicilioData);
        res.status(201).json(domicilio);
    } catch (error) {
        next(new AppError('Error al crear el domicilio', 500));
    }
}


export const eliminarDomicilio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const domicilio = await Domicilio.findByPk(id);
        if (!domicilio) {
            return next(new AppError(`Domicilio con ID ${id} no encontrado`, 404));
        }
        const domicilioEliminado : IDomicilioAttributes = await domicilio.update({ activo: 0 });
        res.status(204).send(domicilioEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el domicilio', 500));
    }
}

export const actualizarDomicilio = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado : IDomicilioUpdate = {};


    try {
        if (req.body.hasOwnProperty('nombre_calle')) objetoActualizado.nombre_calle = req.body.nombre_calle
        if (req.body.hasOwnProperty('numero_calle')) objetoActualizado.numero_calle = req.body.numero_calle;
        if (req.body.hasOwnProperty('entre_calle_1')) objetoActualizado.entre_calle_1 = req.body.entre_calle_1;
        if (req.body.hasOwnProperty('entre_calle_2')) objetoActualizado.entre_calle_2 = req.body.entre_calle_2
        if (req.body.hasOwnProperty('barrio_id')) objetoActualizado.barrio_id = req.body.barrio_id;
        if (req.body.hasOwnProperty('cliente_id')) objetoActualizado.cliente_id = req.body.cliente_id
        if (req.body.hasOwnProperty('piso')) objetoActualizado.piso = req.body.piso
        if (req.body.hasOwnProperty('departamento')) objetoActualizado.departamento = req.body.departamento
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo == '1' ? 1 : 0;

        const [actualizado] = await Domicilio.update(
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

        const dataModificada = await Domicilio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar el domicilio', 500));
    }
};

