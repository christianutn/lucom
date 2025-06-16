import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import Giga from "../models/giga.models.js";

export const  getGigas = async (req, res, next) => {
    try {

        const where = {};


        if (req.query.hasOwnProperty('descripcion')) where.descripcion =  { [Op.like]: `%${req.query.descripcion}%` };;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo; 
        const gigas = await Giga.findAll({
            where: where
        });
        res.status(200).json(gigas);
    } catch (error) {
        next(new AppError('Error al obtener los gigas', 500));
    }
}


export const  getGigaPorId = async (req, res, next) => {
    try {

        const giga = await Giga.findByPk(req.params.id);

        if (!giga) {
            return next(new AppError(`Giga con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(giga);
    } catch (error) {
        next(new AppError(`Error al buscar giga con id: ${req.params.id}`, 500));
    }
}



export const createGiga= async (req, res, next) => {
    try {
        const giga = await Giga.create(req.body);
        res.status(201).json(giga);
    } catch (error) {
        next(new AppError('Error al crear el giga', 500));
    }
}




export const actualizarGiga= async (req, res, next) => {
    const { id } = req.params;

    const objetoActualizado = {};


    try {
        if (req.body.hasOwnProperty('descricion')) objetoActualizado.descricion = req.body.descricion
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo

        const [actualizado] = await Giga.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const dataModificada = await Giga.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        next(new AppError('Error al actualizar el giga', 500));
    }
};



export const eliminarGiga = async(req, res, next) =>{
    try {
        const { id } = req.params;

        const giga = await Giga.findByPk(id);
        if (!giga) {
            return next(new AppError(`Giga con ID ${id} no encontrado`, 404));
        }
        await giga.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el giga', 500));
    }
}


