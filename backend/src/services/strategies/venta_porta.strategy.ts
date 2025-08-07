// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetallePorta from '../../models/detalle_porta.models.js';
import { IStrategyDetalleVenta } from './IStrategyDetalleVenta.js';
import AppError from '../../utils/appError.js';
import { IDetallePortaCreate, IDetallePortaAttributes, IDetallePortaParametro } from '../../types/detallePorta.js'
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

    public async createDetails(detalles: IDetallePortaParametro, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para Portabilidad son requeridos.', 400);
        }

        for (const nim of detalles.NIM_a_portar_lista) {
            const detallePortaACrear: IDetallePortaCreate = {
                venta_id: detalles.venta_id,
                NIM_a_portar: nim,
                gigas: detalles.gigas,
                compania: detalles.compania
            }
            await DetallePorta.create({
                ...detallePortaACrear
            }, { transaction });
        }
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetallePorta.findAll({ where: { venta_id }, transaction });
    }

    public async cargar_nueva_fila(venta: IVentaAttributes, detalles: IDetallePortaParametro, cliente: any, domicilio: any, barrio: any): Promise<any> {
        try {

            for (const nim of detalles.NIM_a_portar_lista) {
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
                const gigas = await Giga.findByPk(detalles.gigas);

                if (!gigas) {
                    throw new AppError('Gigas no encontrado', 404);
                }

                // Buscamos compania 
                const compania = await Compania.findByPk(detalles.compania);

                //Aramamos string del domicilio

                const domicilioString = `${domicilio.nombre_calle?.trim() || 'Domicilio desconocido'} ${domicilio.numero_calle || 'Nro. de calle desconocido'}
            Piso: ${domicilio.piso || 'No aplica'} Dpto: ${domicilio.departamento || 'No aplica'}
            Entre calles: ${domicilio.entre_calle_1 || 'Entre calles desconocidas'} / ${domicilio.entre_calle_2 || 'Entre calles desconocidas'}
            Barrio: ${barrio.nombre || 'Barrio no cargado'}
            `

                //Formateamos desde AAAA-MM-DD a DD/MM/AAAA
                const fechaNacimientoString = cliente.fecha_nacimiento?.split('-').reverse().join('/') || 'Fecha de nacimiento desconocida';


                // const buscamos origen de dato
                const origenDato = await OrigenDato.findByPk(venta.origen_dato_id);


                const nuevaFila: NuevaFilaPorta = {
                    "Marca temporal": `${empleado?.nombre.trim() || 'Nombre desconocido'}, ${empleado?.apellido.trim() || 'Apellido desconocido'} ${venta.fecha_realizacion || 'Fecha y horadesconocida'}`,
                    "Vendedor (Seleccione Vendedor)": vendedor,
                    "Nombre y Apellido Cliente": `${cliente?.nombre.trim() || 'Nombre desconocido'}, ${cliente?.apellido.trim() || 'Apellido desconocido'}`,
                    "DNI / LE / LC / CUIT (ingrese solo números)": numeroDocumentoString,
                    "Fecha Nacimiento Cliente": `${fechaNacimientoString}`,
                    "NIM a Portar (solo linea, no agregar otra info)": nim,
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
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),
            body('detalles.NIM_a_portar_lista')
                .isArray({ min: 1 })
                .withMessage('Debe ser un array con al menos un NIM'),
            body('detalles.NIM_a_portar_lista.*')
                .isString().withMessage('Cada NIM debe ser un string')
                .isLength({ min: 1, max: 15 }).withMessage('Cada NIM debe tener entre 1 y 15 caracteres')
                .customSanitizer(value => value.trim()),
            body('detalles.gigas')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de gigas debe ser un número entero positivo'),
            body('detalles.compania')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de compania debe ser un número entero positivo')
        ]
    }



    //Agregamos fila


}

export default PortaStrategy;