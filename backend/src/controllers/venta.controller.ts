import AppError from "../utils/appError.js";
import Venta from "../models/venta.models.js";
import { DateTime } from "luxon";
import { Request, Response, NextFunction } from "express";
import { IVentaAttributes, IVentaCreate, IVentaUpdate } from "../types/venta.js";
import { IDatalleBafCreate } from '../types/detalle_baf.js';
import { IDetallePortaCreate } from '../types/detallePorta.js';
import { Op, WhereOptions, Transaction } from "sequelize";
import sequelize from "../config/base_datos.js";
import { getStrategy } from "../services/strategies/venta_manager.strategy.js";
import { IUserInRequest } from "../types/usuario.js"
import { IClienteAttributes, IClienteCreate, IClienteUpdate } from "../types/cliente.js";
import { IDomicilioAttributes, IDomicilioCreate, IDomicilioUpdate } from "../types/domicilio.js";
import { ITelefonoPrincipalAttributes, ITelefonoPrincipalCreate, ITelefonoPrincipalUpdate } from "../types/telefono_principal.js";
import { IBarrioAttributes, IBarrioCreate, IBarrioUpdate } from "../types/barrio.js";
import Cliente from "../models/cliente.models.js";
import Domicilio from "../models/domicilio.models.js";
import TelefonoPrincipal from "../models/telefono_principal.models.js";
import Barrio from "../models/barrio.models.js";



export const getVentas = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const where: WhereOptions<IVentaAttributes> = {};


        if (req.query.hasOwnProperty('cliente_id')) where.cliente_id = parseInt(req.query.cliente_id as string);
        if (req.query.hasOwnProperty('activo')) where.activo = req.query.activo === '1' ? 1 : 0; // Convertir a entero
        if (req.query.hasOwnProperty('convergencia')) where.convergencia = req.query.convergencia === '1' ? 1 : 0; // Convertir a entero
        if (req.query.hasOwnProperty('tipo_negocio_id')) where.tipo_negocio_id = parseInt(req.query.tipo_negocio_id as string);
        if (req.query.hasOwnProperty('empleado_id')) where.empleado_id = parseInt(req.query.empleado_id as string);
        if (req.query.hasOwnProperty('origen_dato_id')) where.origen_dato_id = parseInt(req.query.origen_dato_id as string);
        const venta = await Venta.findAll({
            where: where
        });
        res.status(200).json(venta);
    } catch (error) {
        next(new AppError('Error al obtener las ventas', 500));
    }
}


export const getVentaPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const venta = await Venta.findByPk(req.params.id);

        if (!venta) {
            return next(new AppError(`Venta con ID ${req.params.id} no encontrado`, 404));
        }
        res.status(200).json(venta);
    } catch (error) {
        next(new AppError(`Error al buscar ventas con id: ${req.params.id}`, 500));
    }
}



export const createVenta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fecha_realizacion = req.body.fecha_realizacion ? DateTime.fromISO(req.body.fecha_realizacion).toJSDate() : new Date();

        const usuario: IUserInRequest | null = req.user as IUserInRequest;

        const empleado_id = usuario ? usuario.empleado_id : null;

        if (!empleado_id) {
            return next(new AppError('Empleado no encontrado', 404));
        }
        144
        const ventaData: IVentaCreate = {
            fecha_realizacion: fecha_realizacion,
            comentario_horario_contacto: req.body.comentario_horario_contacto,
            convergencia: req.body.convergencia,
            tipo_negocio_id: req.body.tipo_negocio_id,
            cliente_id: req.body.cliente_id,
            domicilio_id: req.body.domicilio_id,
            empleado_id: empleado_id,
            origen_dato_id: req.body.origen_dato_id
        };

        const venta = await Venta.create(ventaData);
        res.status(201).json(venta);
    } catch (error) {
        next(new AppError('Error al crear venta', 500));
    }
}




export const actualizarVenta = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const objetoActualizado: IVentaUpdate = {};


    try {
        if (req.body.hasOwnProperty('convergencia')) objetoActualizado.convergencia = req.body.convergencia === '1' ? 1 : 0; // Convertir a entero
        if (req.body.hasOwnProperty('activo')) objetoActualizado.activo = req.body.activo == '1' ? 1 : 0; // Convertir a entero
        if (req.body.hasOwnProperty('tipo_negocio_id')) objetoActualizado.tipo_negocio_id = parseInt(req.body.tipo_negocio_id as string);
        if (req.body.hasOwnProperty('comentario_horario_contacto')) objetoActualizado.comentario_horario_contacto = req.body.comentario_horario_contacto
        if (req.body.hasOwnProperty('domicilio_id')) objetoActualizado.domicilio_id = parseInt(req.body.domicilio_id as string);
        if (req.body.hasOwnProperty('origen_dato_id')) objetoActualizado.origen_dato_id = parseInt(req.body.origen_dato_id as string);
        const [actualizado] = await Venta.update(
            objetoActualizado,
            {
                where: {
                    id: id
                }
            });

        if (actualizado == 0) {
            res.status(200).json({ message: 'No hubo atributos para actualizar' });
            return;
        }

        const dataModificada = await Venta.findByPk(id);

        res.status(200).json(dataModificada);
    } catch (error) {
        return next(new AppError('Error al actualizar usuario', 500));
    }
};



export const eliminarVenta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return next(new AppError(`Venta con ID ${id} no encontrado`, 404));
        }
        const ventaEliminado: IVentaAttributes = await venta.update({ activo: 0 });
        res.status(204).send(ventaEliminado);
    } catch (error) {
        next(new AppError('Error al eliminar el Venta', 500));
    }
}

export const crearVentaConDetalles = async (req: Request, res: Response, next: NextFunction) => {

    // Cargamos los datos del body de la solicitud
    const detalles: IDetallePortaCreate | IDatalleBafCreate = req.body.detalles;
    const datosVenta: IVentaCreate = req.body.datosVenta;
    const cliente: IClienteAttributes = req.body.cliente;
    const domicilio: IDomicilioAttributes = req.body.domicilio;
    const barrio: IBarrioAttributes = req.body.barrio;
    const telefonos_principales: ITelefonoPrincipalAttributes[] = req.body.telefonos_principales;



    const usuario: IUserInRequest | null = req.user as IUserInRequest;

    const empleado_id = usuario ? usuario.empleado_id : null;

    if (!empleado_id) {
        return next(new AppError('Empleado no encontrado', 404));
    }

    //Cargamos los datos a ventas que no vienen por el body y se calculan automáticamente
    datosVenta.empleado_id = empleado_id;
    datosVenta.fecha_realizacion = DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate();


    // Iniciamos una transacción controlada por Sequelize
    const t: Transaction = await sequelize.transaction();

    try {

        // 1. Creamos o actualizamos cliente
        await tratarCliente(cliente, t);
        integrar_id_cliente(cliente, datosVenta, domicilio, telefonos_principales); // por si se carga nuevo cliente

        // 2. Creamos o actualizamos telefonos_principales
        await tratarTelefonosPrincipales(telefonos_principales, t);

        // 3. Creamos o actualizamos barrio. Primero el barrio ya que el domicilio necesita del id del barrio
        await tratarBarrio(barrio, t);
        integrar_id_barrio(barrio, domicilio);

        // 4. Creamos o actualizamos domicilio
        await tratarDomicilio(domicilio, t);
        integrar_id_domicilio(domicilio, datosVenta);


        // 5. Crear la Venta principal dentro de la transacción
        const nuevaVenta: IVentaAttributes = await Venta.create(datosVenta, { transaction: t });
        if (!nuevaVenta) {
            throw new AppError('No se pudo crear el registro de venta principal.', 500);
        }
        // Agregamos el venta_id a los detalles
        detalles.venta_id = nuevaVenta.id;


        // 6. Cargamos los detalles de la venta que pueden ser BAF PORTA o BBOO(FAlta implementar)
        const strategy = getStrategy(nuevaVenta.tipo_negocio_id);
        await strategy.createDetails(detalles, t); // Se pasa la instancia completa de venta

        //Cargar nueva fila en googlesheets


        await strategy.cargar_nueva_fila(nuevaVenta, detalles, cliente, telefonos_principales, domicilio, barrio);

        const detallesCreados = await strategy.getDetails(nuevaVenta.id, t);

        // 7. Confirmar la transacción
        await t.commit();

        res.status(201).json(detallesCreados);

    } catch (error) {
        await t.rollback(); // Si algo falla, revertir todo

        next(new AppError('Error al crear la venta', 500));
    }
};



//Funciones axiliares a ventaController

const tratarCliente = async (cliente: IClienteAttributes, t: Transaction): Promise<void> => {
    try {

        const clienteEncontrado = await Cliente.findOne({
            where: {
                numero_documento: cliente.numero_documento,
                tipo_documento: cliente.tipo_documento
            },
            transaction: t
        });

        if (clienteEncontrado) {
            cliente.id = clienteEncontrado.id;
        }

        // Si datosCliente.id es undifined o vacío, crear un nuevo cliente, caso contrario actualizarlo
        if (!cliente.id) {

            const nuevoCliente = await Cliente.create({
                tipo_documento: cliente.tipo_documento,
                numero_documento: cliente.numero_documento,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono_secundario: cliente.telefono_secundario,
                correo_electronico: cliente.correo_electronico,
                fecha_nacimiento: cliente.fecha_nacimiento
            }, { transaction: t });

            cliente.id = nuevoCliente.id;

        } else {

            const datosClienteParaActualizar: IClienteUpdate = {
                tipo_documento: cliente.tipo_documento,
                numero_documento: cliente.numero_documento,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono_secundario: cliente.telefono_secundario,
                correo_electronico: cliente.correo_electronico,
                fecha_nacimiento: cliente.fecha_nacimiento
            };

            await Cliente.update(datosClienteParaActualizar, {
                where: {
                    id: cliente.id
                },
                transaction: t
            });

        }

    } catch (error) {
        throw new AppError('Error al tratar el cliente', 500);
    }
}



const tratarTelefonosPrincipales = async (telefonos_principales: ITelefonoPrincipalAttributes[], t: Transaction): Promise<void> => {
    try {
        for (const telefono of telefonos_principales) {
            if (!telefono.id) {


                const nuevoTelefono: ITelefonoPrincipalCreate = {
                    cliente_id: telefono.cliente_id,
                    numero_telefono: telefono.numero_telefono,
                    fecha_modificacion: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate()
                };

                const telefonoCreado = await TelefonoPrincipal.create(nuevoTelefono, { transaction: t });
                telefono.id = telefonoCreado.id;
            } else {
                const telefonoActualizado: ITelefonoPrincipalUpdate = {
                    cliente_id: telefono.cliente_id,
                    numero_telefono: telefono.numero_telefono,
                    fecha_modificacion: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
                };

                await TelefonoPrincipal.update(telefonoActualizado, {
                    where: { id: telefono.id },
                    transaction: t
                });
            }

            // Eliminamos en caso de exister todos aquellos telefonos del cliente que no vienen por la lista
            await TelefonoPrincipal.destroy({
                where: {
                    id: {
                        [Op.notIn]: telefonos_principales.map(telefono => telefono.id)
                    },
                    cliente_id: telefono.cliente_id
                },
                transaction: t
            });
        }
    } catch (error) {
        throw new AppError('Error al tratar los telefonos principales', 500);
    }
};

const tratarDomicilio = async (domicilio: IDomicilioAttributes, t: Transaction): Promise<void> => {
    try {

        const domObject : IDomicilioCreate = {
            cliente_id: domicilio.cliente_id,
            nombre_calle: domicilio.nombre_calle,
            numero_calle: domicilio.numero_calle,
            entre_calle_1: domicilio.entre_calle_1,
            entre_calle_2: domicilio.entre_calle_2,
            barrio_id: domicilio.barrio_id,
        }

        if (domicilio.piso) domObject.piso = domicilio.piso;
        if (domicilio.departamento) domObject.departamento = domicilio.departamento;


        if (!domicilio.id) {

            const domicilioCreado = await Domicilio.create(domObject, { transaction: t });
            domicilio.id = domicilioCreado.id;

        } else {

            await Domicilio.update(domObject, {
                where: {
                    id: domicilio.id
                },
                transaction: t
            });
        }
    } catch (error) {
        throw new AppError('Error al tratar el domicilio', 500);
    }
}

const tratarBarrio = async (barrio: IBarrioAttributes, t: Transaction): Promise<void> => {
    try {

        if (!barrio.id) {
            const nuevoBarrio: IBarrioCreate = {
                nombre: barrio.nombre
            }
            const barrioCreado = await Barrio.create(nuevoBarrio, { transaction: t });
            barrio.id = barrioCreado.id;
        } else {
            const barrioActualizado: IBarrioUpdate = {
                nombre: barrio.nombre
            }
            await Barrio.update(barrioActualizado, {
                where: {
                    id: barrio.id
                },
                transaction: t
            });
        }
    } catch (error) {
        throw new AppError('Error al tratar el barrio', 500);
    }
}

const integrar_id_cliente = (cliente: IClienteAttributes, datosVenta: IVentaCreate, domicilio: IDomicilioAttributes, telefonos_principales: ITelefonoPrincipalAttributes[]) => {
    try {
        datosVenta.cliente_id = cliente.id;
        domicilio.cliente_id = cliente.id;
        for (const telefono of telefonos_principales) {
            telefono.cliente_id = cliente.id;
        }
    } catch (error) {
        throw new AppError('Error al tratar el barrio', 500);
    }
}

const integrar_id_domicilio = (domicilio: IDomicilioAttributes, datosVenta: IVentaCreate) => {
    try {
        datosVenta.domicilio_id = domicilio.id;
    } catch (error) {
        throw new AppError('Error al tratar el domicilio', 500);
    }
}

const integrar_id_barrio = (barrio: IBarrioAttributes, domicilio: IDomicilioAttributes) => {
    try {
        domicilio.barrio_id = barrio.id;
    } catch (error) {
        throw new AppError('Error al tratar el barrio', 500);
    }
}