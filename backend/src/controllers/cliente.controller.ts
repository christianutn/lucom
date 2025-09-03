import Cliente from '../models/cliente.models.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';
import TipoDocumento from '../models/tipo_documento.models.js';
import Domicilio from '../models/domicilio.models.js';
import Barrio from '../models/barrio.models.js';
import { Request, Response, NextFunction } from 'express';
import { WhereOptions } from 'sequelize';
import { IClienteAttributes, IClienteCreate, IClienteFilter, IClienteUpdate } from '../types/cliente.d.js';



export const getClientes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // --- NUEVO: Capturar parámetros de paginación y ordenamiento ---
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 25; // Default: 25 items por página
        const sortBy = req.query.sortBy as string || 'apellido'; // Default: ordenar por apellido
        const order = (req.query.order as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Default: ASC

        const offset = (page - 1) * limit;

        // --- Lógica de filtrado (se mantiene igual) ---
        const where: WhereOptions<IClienteAttributes> = {};

        if (req.query.tipo_documento)
            where.tipo_documento = parseInt(req.query.tipo_documento as string, 10);

        if (req.query.activo)
            where.activo = parseInt(req.query.activo as string, 10) as 0 | 1;

        if (req.query.numero_documento)
            where.numero_documento = { [Op.like]: `%${req.query.numero_documento}%` }; // Búsqueda por DNI también puede ser parcial

        if (req.query.nombre)
            where.nombre = { [Op.like]: `%${req.query.nombre}%` };

        if (req.query.apellido)
            where.apellido = { [Op.like]: `%${req.query.apellido}%` };

        if (req.query.correo_electronico)
            where.correo_electronico = { [Op.like]: `%${req.query.correo_electronico}%` };

        // --- NUEVO: Usar findAndCountAll en lugar de findAll ---
        // `findAndCountAll` es perfecto para paginación. Devuelve tanto los registros de la página
        // como el conteo total de registros que coinciden con la cláusula 'where'.
        const { count, rows } = await Cliente.findAndCountAll({
            where,
            include: [
                { model: TipoDocumento, as: 'tipoDocumento', attributes: ['id', 'descripcion'] },
                { model: Domicilio, as: 'domicilios', include: [{ model: Barrio, as: 'barrio' }] },
                // ... otras inclusiones
            ],
            limit: limit,
            offset: offset,
            order: [[sortBy, order]],
            distinct: true // Importante cuando usas 'include' para que 'count' sea preciso
        });

        // --- NUEVO: Construir la respuesta con metadatos de paginación ---
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            data: rows, // Los registros de la página actual
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit
            }
        });

    } catch (error) {
        // ... (el manejo de errores se mantiene igual)
        console.error("Error al obtener clientes:", error);
        return next(new AppError('Error al obtener los clientes', 500));
    }
};

export const createCliente = async (req: Request, res: Response, next: NextFunction) => {

    const nuevoClliente: IClienteCreate = {
        tipo_documento: req.body.tipo_documento,
        numero_documento: req.body.numero_documento,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono_principal: req.body.telefono_principal,
        correo_electronico: req.body.correo_electronico
        
    };

    if (req.body.telefono_secundario) nuevoClliente.telefono_secundario = req.body.telefono_secundario;
    if (req.body.fecha_nacimiento) nuevoClliente.fecha_nacimiento = req.body.fecha_nacimiento

    try {
        const cliente = await Cliente.create(nuevoClliente);
        res.status(201).json(cliente);
    } catch (error) {
       return next(new AppError('Error al crear el cliente', 500));
    }
};


export const eliminarCliente = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) throw new AppError('El cliente no existe', 400);
        const clienteEliminado : IClienteAttributes = await cliente.update({ activo: 0 });
        res.status(204).json(clienteEliminado);
    } catch (error) {
        return next(new AppError('Error al eliminar el cliente', 500));
    }
};

export const actualizarCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const clienteActualizado: IClienteUpdate = {};

        if(req.body.tipo_documento) clienteActualizado.tipo_documento = parseInt(req.body.tipo_documento as string, 10);
        if(req.body.numero_documento) clienteActualizado.numero_documento = req.body.numero_documento as string;
        if(req.body.nombre) clienteActualizado.nombre = req.body.nombre as string;
        if(req.body.apellido) clienteActualizado.apellido = req.body.apellido as string;
        if(req.body.telefono_secundario) clienteActualizado.telefono_secundario = req.body.telefono_secundario as string;
        if(req.body.fecha_nacimiento) clienteActualizado.fecha_nacimiento = req.body.fecha_nacimiento as string;
        if(req.body.correo_electronico) clienteActualizado.correo_electronico = req.body.correo_electronico as string;

        // Validar que al menos un campo sea haya enviado una propiedad para actualizar
        if (Object.keys(clienteActualizado).length === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }


        // Ejecutar el update
        const [actualizado] = await Cliente.update(clienteActualizado, {
            where: { id: id }
        });

        if (actualizado === 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar o el cliente no existe' });
            return;
        }

        const clienteModificado = await Cliente.findByPk(id);

        res.status(200).json(clienteModificado);
    } catch (error) {
       return next(new AppError('Error al actualizar el cliente', 500));
    }
};


