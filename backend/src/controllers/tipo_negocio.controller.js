import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import TipoNegocio from "../models/tipo_negocio.models.js";
export const  getTipoNegocio = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const tipoNegocio = await TipoNegocio.findAll({
            where: where
        });
        res.status(200).json(tipoNegocio);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de negocio', 500));
    }
}


export const  getTipoNegocioPorId = async (req, res, next) => {
    try {

        const tipoNegocio = await TipoNegocio.findByPk(req.params.id);

        if (!tipoNegocio) {
            return next(new AppError(`Tipo de negocio con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoNegocio);
    } catch (error) { 
         next(new AppError(`Error al buscar tipo de negocio con id: ${req.params.id}`, 500));
    }
}



export const createTipoNegocio= async (req, res, next) => {
    try {
        const tipoNegocio = await TipoNegocio.create(req.body);
        res.status(201).json(tipoNegocio);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de negocio', 500));
    }
}




export const actualizarTipoNegocio= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await TipoNegocio.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await TipoNegocio.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el tipo de negocio', 500));
    }
};



export const eliminarTipoNegocio = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const tipoNegocio = await TipoNegocio.findByPk(id);
        if (!tipoNegocio) {
            return next(new AppError(`Tipo de negocio con ID ${id} no encontrado`, 404));
        }
        await tipoNegocio.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de negocio', 500));
    }
}


