import Cliente from '../models/cliente.models.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';
import TipoDocumento from '../models/tipo_documento.models.js';
import Domicilio from '../models/domicilio.models.js';
import TelefonoPrincipal from '../models/telefono_principal.models.js';
import Barrio from '../models/barrio.models.js';
export const getClientes = async (req, res, next) => {
  

    try {
        const where = {};

        if (req.query.hasOwnProperty('tipo_documento')) where.tipo_documento = req.query.tipo_documento;
        if (req.query.hasOwnProperty('numero_documento')) where.numero_documento = req.query.numero_documento;
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo;
        if (req.query.hasOwnProperty('nombre')) where.nombre = { [Op.like]: `%${req.query.nombre}%` };
        if (req.query.hasOwnProperty('apellido')) where.apellido = { [Op.like]: `%${req.query.apellido}%` };
        if (req.query.hasOwnProperty('correo_electronico')) where.correo_electronico = { [Op.like]: `%${req.query.correo_electronico}%` };

        const clientes = await Cliente.findAll({
            where,
            include: [
                {
                    model: TipoDocumento,
                    as: 'tipoDocumento',
                    attributes: ['id', 'descripcion']
                },
                {
                    model: Domicilio,
                    as: 'domicilios',
                    include: [
                        {
                            model: Barrio,
                            as: 'barrio'
                        }
                    ]
                },
                {
                    model: TelefonoPrincipal,
                    as: 'telefonosPrincipales',
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

    const nuevoClliente = {}

    if (req.body.hasOwnProperty('tipo_documento')) nuevoClliente.tipo_documento = req.body.tipo_documento;
    if (req.body.hasOwnProperty('numero_documento')) nuevoClliente.numero_documento = req.body.numero_documento;
    if (req.body.hasOwnProperty('nombre')) nuevoClliente.nombre = req.body.nombre;
    if (req.body.hasOwnProperty('apellido')) nuevoClliente.apellido = req.body.apellido;
    if (req.body.hasOwnProperty('telefono_secundario')) nuevoClliente.telefono_secundario = req.body.telefono_secundario;
    if (req.body.hasOwnProperty('fecha_nacimiento')) nuevoClliente.fecha_nacimiento = req.body.fecha_nacimiento;

    try {
        const cliente = await Cliente.create(nuevoClliente);
        res.status(201).json(cliente);
    } catch (error) {
        return next(new AppError('Error al crear el cliente', 500));
    }
};


export const eliminarCliente = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Cliente.destroy({
            where: {
                id: id
            }
        });
        res.status(204).json();
    } catch (error) {
        return next(new AppError('Error al eliminar el cliente', 500));
    }
};

export const actualizarCliente = async (req, res, next) => {
    try {

        const { id } = req.params;
        const clienteActualizado = {};

        if (req.body.hasOwnProperty('nombre')) clienteActualizado.nombre = req.body.nombre;
        if (req.body.hasOwnProperty('apellido')) clienteActualizado.apellido = req.body.apellido;
        if (req.body.hasOwnProperty('telefono_secundario')) clienteActualizado.telefono_secundario = req.body.telefono_secundario;
        if (req.body.hasOwnProperty('fecha_nacimiento')) clienteActualizado.fecha_nacimiento = req.body.fecha_nacimiento;
        if (req.body.hasOwnProperty('activo')) clienteActualizado.activo = req.body.activo;


        const [actualizado] = await Cliente.update(clienteActualizado,
            {
                where: {
                    id: id,
                }
            }
        );

        if (actualizado === 0) {
            return res.status(200).json({ message: 'No hubo atributos para actualizar' });
        }

        const clienteModificado = await Cliente.findOne({
            where: {
                id : id
            }
        })
        res.status(200).json(clienteModificado);
    } catch (error) {
        next(new AppError('Error al actualizar el cliente', 500));
    }
};

