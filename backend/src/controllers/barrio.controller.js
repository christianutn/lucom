import Barrio from '../models/barrio.models.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';

export const getBarrios = async (req, res, next) => {
    const { activo, nombre, codigo_postal } = req.query;
    try {
        const where = {};
        if (activo) where.activo = activo;
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
        if (codigo_postal) where.codigo_postal = { [Op.like]: `%${codigo_postal}%` };
        

        const barrios = await Barrio.findAll({ where });

        if (barrios.length === 0) {
            return next(new AppError('No se encontraron barrios', 404));
        }
        res.json(barrios.map(barrio => ({
            id: barrio.id,
            nombre: barrio.nombre,
            codigo_postal: barrio.codigo_postal,
            activo: barrio.activo,
        })));
    } catch (error) {
        next(new AppError('Error al obtener los barrios', 500));
    }
};

export const getBarrioById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const barrio = await Barrio.findByPk(id);
        if (!barrio) {
            return next(new AppError(`Barrio con ID ${id} no encontrado`, 404));
        }
        res.status(200).json({
            id: barrio.id,
            nombre: barrio.nombre,
            codigo_postal: barrio.codigo_postal,
            activo: barrio.activo,
        });
    } catch (error) {
        next(new AppError('Error al obtener el barrio', 500));
    }
};

export const createBarrio = async (req, res, next) => {
    const { nombre, codigo_postal } = req.body;
    try {
        const newBarrio = await Barrio.create({ 
            nombre: nombre.trim(),
            codigo_postal: codigo_postal?.trim()
        });
        res.status(201).json({
            id: newBarrio.id,
            nombre: newBarrio.nombre,
            codigo_postal: newBarrio.codigo_postal,
            activo: newBarrio.activo,
        });
    } catch (error) {
        next(new AppError('Error al crear el barrio', 500));
    }
};

export const actualizarBarrio = async (req, res, next) => {
    try {
        const { nombre, codigo_postal, activo} = req.body;
        const { id } = req.params;

        const datosNuevoBarrio = {};
        if(req.body.hasOwnProperty('nombre')) datosNuevoBarrio.nombre = nombre.trim();
        if(req.body.hasOwnProperty('codigo_postal')) datosNuevoBarrio.codigo_postal = codigo_postal?.trim();
        if(req.body.hasOwnProperty('activo')) datosNuevoBarrio.activo = activo;

        
        const [actualizado] = await Barrio.update(
            datosNuevoBarrio,
            {
                where: {
                    id
                }
            }
        );

        if(actualizado === 0) return res.status(200).json({ message: 'No hubo atributos para actualizar' });

        const barrio = await Barrio.findByPk(id);
    
        res.status(200).json(barrio);
    } catch (error) {
        next(new AppError('Error al actualizar el barrio', 500));
    }
};

export const eliminarBarrio = async (req, res, next) => {
    const { id } = req.params;
    try {
        const barrio = await Barrio.findByPk(id);
        if (!barrio) {
            return next(new AppError(`Barrio con ID ${id} no encontrado`, 404));
        }
        await barrio.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('Error al eliminar el barrio', 500));
    }
};
