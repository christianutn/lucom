import Domicilio from "../models/domicilio.models.js";
import AppError from "../utils/appError.js";
import Cliente from "../models/cliente.models.js";
import Barrio from "../models/barrio.models.js";


export const getDomicilios = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id = req.query.cliente_id;
        if (req.query.hasOwnProperty('barrio_id')) where.barrio_id = req.query.barrio_id;
        if (req.query.hasOwnProperty('nombre_calle')) where.activo = req.query.nombre_calle;
        if (req.query.hasOwnProperty('numero_calle')) where.activo = req.query.numero_calle;
       
        
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


export const createDomicilio = async (req, res) => {
    try {
        const domicilio = await Domicilio.create(req.body);
        res.status(201).json(domicilio);
    } catch (error) {
        next(new AppError('Error al crear el domicilio', 500));
    }
}


export const eliminarDomicilio = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const domicilio = await Domicilio.findByPk(id);
        if (!domicilio) {
            return next(new AppError(`Domicilio con ID ${id} no encontrado`, 404));
        }
        await domicilio.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el domicilio', 500));
    }
}

export const actualizarDomicilio = async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('nombre_calle')) objetoActualizado.nombre_calle = req.body.nombre_calle
        if (req.body.hasOwnProperty('numero_calle')) objetoActualizado.numero_calle = req.body.numero_calle;
        if (req.body.hasOwnProperty('entre_calle_1')) objetoActualizado.entre_calle_1 = req.body.entre_calle_1;
        if (req.body.hasOwnProperty('entre_calle_2')) objetoActualizado.entre_calle_2 = req.body.entre_calle_2
        if (req.body.hasOwnProperty('barrio_id')) objetoActualizado.barrio_id = req.body.barrio_id;
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo;
        if (req.body.hasOwnProperty('cliente_id')) objetoActualizado.cliente_id = req.body.cliente_id

        const [actualizado] = await Domicilio.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Domicilio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el domicilio', 500));
    }
};

