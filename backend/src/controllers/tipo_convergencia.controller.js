import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import TipoConvergencia from "../models/tipo_convergencia.models.js";
export const  getTipoConvergencia = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const tipoConvergencia = await TipoConvergencia.findAll({
            where: where
        });
        res.status(200).json(tipoConvergencia);
    } catch (error) {
        next(new AppError('Error al obtener los Tipos de convergencias', 500));
    }
}


export const  getTipoConvergenciaPorId = async (req, res, next) => {
    try {

        const tipoConvergencia = await TipoConvergencia.findByPk(req.params.id);

        if (!tipoConvergencia) {
            return next(new AppError(`Tipo de Convergencia con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(tipoConvergencia);
    } catch (error) {
        next(new AppError(`Error al buscar origen  de datos con id: ${req.params.id}`, 500));
    }
}



export const createTipoConvergencia= async (req, res, next) => {
    try {
        const tipoConvergencia = await TipoConvergencia.create(req.body);
        res.status(201).json(tipoConvergencia);
    } catch (error) {
        next(new AppError('Error al crear el Tipo de Convergencias', 500));
    }
}




export const actualizarTipoConvergencia= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descricion')) objetoActualizado.descricion = req.body.descricion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await TipoConvergencia.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await TipoConvergencia.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarTipoConvergencia = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const tipoConvergencia = await TipoConvergencia.findByPk(id);
        if (!tipoConvergencia) {
            return next(new AppError(`Tipo de Convergencia con ID ${id} no encontrado`, 404));
        }
        await tipoConvergencia.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el tipo de convergencia', 500));
    }
}


