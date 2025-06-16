import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import OrigenDato from "../models/origen_dato.models.js";
export const  getOrigenDato = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const origen = await OrigenDato.findAll({
            where: where
        });
        res.status(200).json(origen);
    } catch (error) {
        next(new AppError('Error al obtener los Origen de Datos', 500));
    }
}


export const  getOrigenDatoPorId = async (req, res, next) => {
    try {

        const origen = await OrigenDato.findByPk(req.params.id);

        if (!origen) {
            return next(new AppError(`Origen de datos con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(origen);
    } catch (error) {
        next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createOrigenDato= async (req, res, next) => {
    try {
        const origen = await OrigenDato.create(req.body);
        res.status(201).json(origen);
    } catch (error) {
        next(new AppError('Error al crear el origen de datos', 500));
    }
}




export const actualizarOrigenDato= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descricion')) objetoActualizado.descricion = req.body.descricion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await OrigenDato.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await OrigenDato.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarOrigenDato = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const origen = await OrigenDato.findByPk(id);
        if (!origen) {
            return next(new AppError(`Giga con ID ${id} no encontrado`, 404));
        }
        await origen.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


