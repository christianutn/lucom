import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import TipoDocumento from "../models/tipo_documento.models.js";
export const  getTipoDocumento = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const tipoDocumento = await TipoDocumento.findAll({
            where: where
        });
        res.status(200).json(tipoDocumento);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de convergencias', 500));
    }
}


export const  getTipoDocumentoPorId = async (req, res, next) => {
    try {

        const tipoDocumento = await TipoDocumento.findByPk(req.params.id);

        if (!tipoDocumento) {
            return next(new AppError(`Tipo de Convergencia con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoDocumento);
    } catch (error) { 
         next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoDocumento= async (req, res, next) => {
    try {
        const tipoDocumento = await TipoDocumento.create(req.body);
        res.status(201).json(tipoDocumento);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de Convergencias', 500));
    }
}




export const actualizarTipoDocumento= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descripcion')) objetoActualizado.descripcion = req.body.descripcion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await TipoDocumento.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await TipoDocumento.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoDocumento = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const descripcion = await TipoDocumento.findByPk(id);
        if (!descripcion) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        await descripcion.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


