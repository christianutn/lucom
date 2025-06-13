import Cliente from '../models/cliente.models.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';
import TipoDocumento from '../models/tipo_documento.models.js';
export const getClientes = async (req, res, next) => {
    const { tipo_documento, numero_documento, nombre, apellido, activo } = req.query;

    try {
        const where = {};

        if (tipo_documento) where.tipo_documento = tipo_documento;
        if (numero_documento) where.numero_documento = { [Op.like]: `%${numero_documento}%` };
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
        if (apellido) where.apellido = { [Op.like]: `%${apellido}%` };
        if (activo) where.activo = activo;

        const clientes = await Cliente.findAll({
            where,
            include: [
                {
                    model: TipoDocumento,
                    as: 'tipoDocumento',
                    attributes: ['codigo', 'descripcion']
                }
            ]
        });
        if (clientes.length === 0) {
            return next(new AppError('No se encontraron clientes', 404));
        }

        res.status(200).json(clientes);

        // convertir los clientes a un array de objetos más pequeños con solo los campos que necesitamos

    } catch (error) {
        return next(new AppError('Error al obtener los clientes', 500));
    }

};


export const createCliente = async (req, res, next) => {
    const {
        tipo_documento,
        numero_documento,
        nombre,
        apellido,
        telefono_secundario,
        fecha_nacimiento
    } = req.body;

    const nuevoClliente = {}

    if (tipo_documento) nuevoClliente.tipo_documento = tipo_documento;
    if (numero_documento) nuevoClliente.numero_documento = numero_documento;
    if (nombre) nuevoClliente.nombre = nombre;
    if (apellido) nuevoClliente.apellido = apellido;
    if (telefono_secundario) nuevoClliente.telefono_secundario = telefono_secundario;
    if (fecha_nacimiento) nuevoClliente.fecha_nacimiento = fecha_nacimiento;

    try {
        const cliente = await Cliente.create(nuevoClliente);
        res.status(201).json(cliente);
    } catch (error) {
        return next(new AppError('Error al crear el cliente', 500));
    }
};


export const deleteCliente = async (req, res, next) => {
    const { tipo_documento, numero_documento } = req.body;
    try {
        await Cliente.destroy({
            where: {
                tipo_documento,
                numero_documento
            }
        });
        res.status(204).json();
    } catch (error) {
        return next(new AppError('Error al eliminar el cliente', 500));
    }
};

export const actualizarCliente = async (req, res, next) => {
    try {
        const { 
            tipo_documento,
            numero_documento,
            nombre,
            apellido,
            telefono_secundario,
            fecha_nacimiento,
            activo
         } = req.body;
        const clienteActualizado = {};

        if (req.body.hasOwnProperty('nombre')) clienteActualizado.nombre = nombre;
        if (req.body.hasOwnProperty('apellido')) clienteActualizado.apellido = apellido;
        if (req.body.hasOwnProperty('telefono_secundario')) clienteActualizado.telefono_secundario = telefono_secundario;
        if (req.body.hasOwnProperty('fecha_nacimiento')) clienteActualizado.fecha_nacimiento = fecha_nacimiento;
        if (req.body.hasOwnProperty('activo')) clienteActualizado.activo = activo;


        const [actualizado] = await Cliente.update(clienteActualizado,
            {
                where: {
                    tipo_documento,
                    numero_documento
                }
            }
        );

        if (actualizado === 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const clienteModificado = await Cliente.findOne({
            where: {
                tipo_documento,
                numero_documento
            }
        })
        res.status(200).json(clienteModificado);
    } catch (error) {
        next(new AppError('Error al actualizar el cliente', 500));
    }
};

