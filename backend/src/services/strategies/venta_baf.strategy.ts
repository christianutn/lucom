// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetalleBaf from '../../models/detalle_baf.models.js';
import { IStrategyDetalleVenta } from './IStrategyDetalleVenta.js';
import AppError from '../../utils/appError.js';
import { IDatalleBafCreate } from '../../types/detalle_baf.js'
import { IVentaAttributes } from '../../types/venta.js';
import { NuevaFilaBaf } from '../../types/googleSheets.js';
import { IBarrioAttributes } from '../../types/barrio.js';
import { IDomicilioAttributes } from '../../types/domicilio.js';
import Empleado from "../../models/empleado.models.js";
import TipoDocumento from "../../models/tipo_documento.models.js";
import Abono from "../../models/abono.models.js";
import TipoDomicilio from "../../models/tipo_domicilio.models.js";
import TipoConvergencia from "../../models/tipo_convergencia.models.js";
import OrigenDato from '../../models/origen_dato.models.js';
import { agregarFilaPorNombreColumnas } from "../../googleSheets/cargarDatosBAF.js";


//Importamos interfaces
import { IClienteAttributes } from '../../types/cliente.js';
import { IDetallePortaCreate } from '../../types/detallePorta.js';
class BafStrategy implements IStrategyDetalleVenta {

    public async createDetails(detalles: IDatalleBafCreate, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para BAF son requeridos.', 400);
        }

        return DetalleBaf.create({
            ...detalles
        }, { transaction });
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetalleBaf.findAll({ where: { venta_id }, transaction });
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),
            body('detalles.tipos_domicilios_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El tipos_domicilios_id debe ser un número entero positivo'),
            body('detalles.abono_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El abono_id debe ser un número entero positivo'),
            body('detalles.TVHD')
                .exists()
                .trim()
                .isIn([0, 1])
                .withMessage('El tvhd debe ser un 1 o 0'),
            body('detalles.cantidad_decos')
                .exists()
                .trim()
                .isInt({ min: 0 })
                .withMessage('El cantidad_decos debe ser un número entero positivo'),
            body('detalles.tipo_convergencia_id')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El tipo_convergencia_id debe ser un número entero positivo'),
            body('detalles.horario_contacto')
                .optional({ checkFalsy: true })
                .isString()
                .trim()
                .isLength({ min: 0, max: 150 })
                .withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
        ]
    }

    public async cargar_nueva_fila(venta: IVentaAttributes, detalles: IDatalleBafCreate, cliente: IClienteAttributes, domicilio: IDomicilioAttributes, barrio: IBarrioAttributes): Promise<any> {
        try {
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

            //Armamos string con los numeros de teléfonos principales
            const telefono_principal = cliente.telefono_principal;

            //Buscamos abono
            const abono = await Abono.findByPk(detalles.abono_id);

            if (!abono) {
                throw new AppError('Abono no encontrado', 404);
            }

            // Buscamos origen de dato

            const origenDato = await OrigenDato.findByPk(venta.origen_dato_id);

            if (!origenDato) {
                throw new AppError('Origen de dato no encontrado', 404);
            }

            // Buscamos tipo de convergencia

            const tipoConvergencia = await TipoConvergencia.findByPk(detalles.tipo_convergencia_id);

            if (!tipoConvergencia) {
                throw new AppError('Tipo de convergencia no encontrado', 404);
            }


            //Buscamos tipo de domicilio
            const tipoDomicilio = await TipoDomicilio.findByPk(detalles.tipos_domicilios_id);

            if (!tipoDomicilio) {
                throw new AppError('Tipo de domicilio no encontrado', 404);
            }

            //Aramamos string del domicilio

            const domicilioString = `${domicilio.nombre_calle?.trim() || 'Domicilio desconocido'} ${domicilio.numero_calle || 'Nro. de calle desconocido'}
            Piso: ${domicilio.piso || 'No aplica'} Dpto: ${domicilio.departamento || 'No aplica'}
            Entre calles: ${domicilio.entre_calle_1 || 'Entre calles desconocidas'} / ${domicilio.entre_calle_2 || 'Entre calles desconocidas'}
            Barrio: ${barrio.nombre || 'Barrio no cargado'}
            `

            //Formateamos desde AAAA-MM-DD a DD/MM/AAAA
            const fechaNacimientoString = cliente.fecha_nacimiento?.split('-').reverse().join('/') || 'Fecha de nacimiento desconocida';


            const nuevaFila: NuevaFilaBaf = {
                "Marca temporal": `${empleado?.nombre.trim() || 'Nombre desconocido'}, ${empleado?.apellido.trim() || 'Apellido desconocido'} - ${venta.fecha_realizacion || 'Fecha y horadesconocida'}`,
                "Vendedor": `${empleado?.nombre || 'Nombre desconocido'}, ${empleado?.apellido || 'Apellido desconocido'}`,
                "DNI (solo numeros, sin puntos. Si es CUIT anteponer CUIT al número)": `${tipoDocumento?.descripcion}:  ${cliente.numero_documento.trim() || 'Documento desconocido'}`,
                "Apellido y Nombre": `${cliente?.apellido.trim() || 'Apellido desconocido'}, ${cliente?.nombre.trim() || 'Nombre desconocido'}`,
                "Fecha Nacim.": `${fechaNacimientoString}`,
                "Domicilio": `${domicilioString}`,
                "Entre Calles": `${domicilio?.entre_calle_1 || 'Entre calles desconocidas'} / ${domicilio?.entre_calle_2 || 'Entre calles desconocidas'}`,
                "Telefono1": `${telefono_principal}`,
                "Telefono2 IMPORTANTE mejora contacto!": `${cliente?.telefono_secundario ? cliente.telefono_secundario : 'Telefono desconocido'}`,
                "email": `${cliente?.correo_electronico || 'Correo electronico no cargado'}`,
                "Abono": `${abono?.descripcion || 'Abono desconocido'}`,
                "TVHD": `${detalles?.TVHD == 1 ? 'SI' : 'NO'}`,
                "Cant. DECOS": `${detalles?.cantidad_decos || "Cant. de decos desconocido"}`,
                "ZONA": `${barrio?.nombre || 'Barrio no cargado'}`,
                "Horario Contacto / OBSERVACIONES": `${detalles?.horario_contacto || 'Horario de contacto desconocido'}`,
                "Origen Dato": `${origenDato?.descripcion || 'Origen de datos desconocido'}`,
                "PORTABILIDAD - CONVERGENCIA": `${tipoConvergencia?.descripcion || 'Tipo de convergencia desconocido'}`,
                "TIPO DOMICILIO": `${tipoDomicilio?.descripcion}`,
            };
            console.log(nuevaFila)

            // Tipo de negocio = 2 -> BAF
            await agregarFilaPorNombreColumnas(nuevaFila, venta.tipo_negocio_id);

        } catch (error) {
            throw new AppError('Error al cargar la nueva fila', 500);
        }
    }
}

export default BafStrategy;