// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetallePorta from '../../models/detalle_porta.models.js';
import { IStrategyDetalleVenta } from './IStrategyDetalleVenta.js';
import AppError from '../../utils/appError.js';
import { IDetallePortaCreate, IDetallePortaParametro } from '../../types/detallePorta.js'
import { agregarFilaPorNombreColumnas } from "../../googleSheets/cargarDatosBAF.js";
import { IVentaAttributes } from '../../types/venta.js';
import { NuevaFilaPorta } from "../../types/googleSheets.js";
import Empleado from "../../models/empleado.models.js";
import TipoDocumento from "../../models/tipo_documento.models.js";
import Giga from "../../models/giga.models.js";
import Compania from "../../models/compania.models.js";
import Domicilio from '../../models/domicilio.models.js';
import OrigenDato from '../../models/origen_dato.models.js';


class PortaStrategy implements IStrategyDetalleVenta {

    public async createDetails(detalles: IDetallePortaParametro[], transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para Portabilidad son requeridos.', 400);
        }

        for (const nim of detalles) {
            const detallePortaACrear: IDetallePortaCreate = {
                venta_id: nim.venta_id,
                NIM_a_portar: nim.nimAPortar,
                gigas: nim.gigasId,
                compania: nim.companiaId
            }
            await DetallePorta.create({
                ...detallePortaACrear
            }, { transaction });
        }
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetallePorta.findAll({ where: { venta_id }, transaction });
    }

    public async cargar_nueva_fila(venta: IVentaAttributes, detalles: IDetallePortaParametro[], cliente: any, domicilio: any, barrio: any): Promise<any> {
        try {

            for (const nim of detalles) {
                //Buscamos nombre empleado
                const empleado = await Empleado.findByPk(venta.empleado_id);

                if (!empleado) {
                    throw new AppError('Empleado no encontrado', 404);
                }

                //Buscamos tipo de documento
                const tipoDocumento = await TipoDocumento.findByPk(cliente.tipo_documento);

                if (!tipoDocumento) {
                    throw new AppError('Tipo de documento no encontrado', 404);
                }


                // Armamos string de contacto

                const telefono_principal = cliente.telefono_principal

                const contacto = `Telefono principal: ${telefono_principal} / Secundario: ${cliente.telefono_secundario}`

                // Armamos string para Vendedor

                const vendedor = `${empleado?.nombre || 'Nombre desconocido'}, ${empleado?.apellido || 'Apellido desconocido'} <${empleado?.correo_electronico || 'Correo electronico no cargado'}>`

                //armamos dni
                const numeroDocumentoString = `${tipoDocumento?.descripcion}:  ${cliente.numero_documento.trim() || 'Documento desconocido'}`

                // Buscamos gigas
                const gigas = await Giga.findByPk(nim.gigasId);

                if (!gigas) {
                    throw new AppError('Gigas no encontrado', 404);
                }

                // Buscamos compania 
                const compania = await Compania.findByPk(nim.companiaId);

                //Aramamos string del domicilio

                const piso = domicilio.piso ? ` - Piso: ${domicilio.piso}` : '';
                const departamento = domicilio.departamento ? ` - Dpto: ${domicilio.departamento}` : '';
                const entreCalles = domicilio.entre_calle_1 || domicilio.entre_calle_2 ? ` - Entre calles: ${domicilio.entre_calle_1 || 'No ingresada'} / ${domicilio.entre_calle_2 || 'No ingresada'}` : '';

                const domicilioString = `${domicilio.nombre_calle?.trim() || 'Domicilio no ingresado'} ${domicilio.numero_calle || 'Nro. de calle no ingresado'}${piso}${departamento}${entreCalles}${barrio.nombre ? `Barrio: ${barrio.nombre}` : ''}`;


                //Formateamos desde AAAA-MM-DD a DD/MM/AAAA
                const fechaNacimientoString = cliente.fecha_nacimiento?.split('-').reverse().join('/') || '';


                // const buscamos origen de dato
                const origenDato = await OrigenDato.findByPk(venta.origen_dato_id);

                const fechaFormateada = new Date(venta.fecha_realizacion)
                    .toLocaleString('es-AR', { hour12: false });


                const nuevaFila: NuevaFilaPorta = {
                    "Marca temporal": `${fechaFormateada}`,
                    "Vendedor (Seleccione Vendedor)": empleado.alias,
                    "Nombre y Apellido Cliente": `${cliente?.nombre.trim() || 'Nombre desconocido'}, ${cliente?.apellido.trim() || 'Apellido desconocido'}`,
                    "DNI / LE / LC / CUIT (ingrese solo números)": numeroDocumentoString,
                    "Fecha Nacimiento Cliente": `${fechaNacimientoString}`,
                    "NIM a Portar (solo linea, no agregar otra info)": nim.nimAPortar,
                    "Correo Cliente": `${cliente?.correo_electronico || 'Correo electronico no cargado'}`,
                    "Gigas acordados con el cliente": gigas?.descripcion || 'Gigas desconocido',
                    "Compañía Actual": compania?.descripcion || 'Compañia desconocido',
                    "CONTACTO ALTERNATIVO": contacto,
                    "Domicilio del Cliente (ingrese calle, nro, piso, dpto, entrecalles y otros datos extras)": domicilioString,
                    "ORIGEN DATO": origenDato?.descripcion || 'Origen de dato desconocido'

                };


                // Tipo de negocio = 2 -> BAF
                await agregarFilaPorNombreColumnas(nuevaFila, venta.tipo_negocio_id);
            }


        } catch (error) {
            throw new AppError('Error al cargar la nueva fila', 500);
        }
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles')
                .isArray({ min: 1 })
                .withMessage('Debe ser una lista con al menos un detalle'),

            // Validar cada objeto dentro de la lista
            body('detalles.*.nimAPortar')
                .isArray({ min: 1 })
                .withMessage('Cada detalle debe tener al menos un NIM'),

            body('detalles.*.nimAPortar.*')
                .isString().withMessage('Cada NIM debe ser un string')
                .isLength({ min: 1, max: 15 }).withMessage('Cada NIM debe tener entre 1 y 15 caracteres')
                .customSanitizer(value => value.trim()),

            body('detalles.*.gigasId')
                .exists().withMessage('El campo gigas es requerido')
                .bail()
                .isInt({ min: 1 })
                .withMessage('El id de gigas debe ser un número entero positivo'),

            body('detalles.*.companiaId')
                .exists().withMessage('El campo compania es requerido')
                .bail()
                .isInt({ min: 1 })
                .withMessage('El id de compania debe ser un número entero positivo')
        ]
    }


    //Agregamos fila


}

export default PortaStrategy;