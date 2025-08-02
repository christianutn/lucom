// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetalleBboo from '../../models/detalle_bboo.models.js';
import { IStrategyDetalleVenta } from './IStrategyDetalleVenta.js';
import AppError from '../../utils/appError.js';
import { IDetalleBbooCreate } from '../../types/detalle_bboo.js'
import { agregarFilaPorNombreColumnas } from "../../googleSheets/cargarDatosBAF.js";
import { IVentaAttributes } from '../../types/venta.js';
import { NuevaFilaBboo } from "../../types/googleSheets.js";
import Empleado from "../../models/empleado.models.js";
import TipoDocumento from "../../models/tipo_documento.models.js";
import TipoDomicilio from "../../models/tipo_domicilio.models.js";
import OrigenDato from '../../models/origen_dato.models.js';


class BbooStrategy implements IStrategyDetalleVenta {

    public async createDetails(detalles: IDetalleBbooCreate, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para Portabilidad son requeridos.', 400);
        }

        return DetalleBboo.create({
            ...detalles
        }, { transaction });
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetalleBboo.findAll({ where: { venta_id }, transaction });
    }

    public async cargar_nueva_fila(venta: IVentaAttributes, detalles: IDetalleBbooCreate, cliente: any, domicilio: any, barrio: any): Promise<any> {
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


            // Armamos string de contacto

            const telefono_principal = cliente.telefono_principal;


            const contacto = `Telefonoprincipal: ${telefono_principal} / Secundario: ${cliente.telefono_secundario}`

            // Armamos string para Vendedor

            const vendedor = `${empleado?.nombre || 'Nombre desconocido'}, ${empleado?.apellido || 'Apellido desconocido'} <${empleado?.correo_electronico || 'Correo electronico no cargado'}>`

            //armamos dni
            const numeroDocumentoString = `${tipoDocumento?.descripcion}:  ${cliente.numero_documento.trim() || 'Documento desconocido'}`

            // Buscamos tipo de domiclio
            const tipoDomicilio = await TipoDomicilio.findByPk(detalles.tipos_domicilios_id);

            //armamos string con entrecalles
            let entreCallesString = `${domicilio.entre_calle_1 || 'No ingresado'} / ${domicilio.entre_calle_2 || 'No ingresado'}`
            if (!domicilio.entre_calle_1 && !domicilio.entre_calle_2) {
                entreCallesString = "No ingresado"
            }
            //Aramamos string del domicilio

            

            const domicilioString = `${domicilio.nombre_calle?.trim() || 'Domicilio desconocido'} ${domicilio.numero_calle || 'Nro. de calle desconocido'}

            Piso: ${domicilio.piso || 'No aplica'} Dpto: ${domicilio.departamento || 'No aplica'}
            Entre calles: ${entreCallesString}
            Barrio: ${barrio.nombre || 'Barrio no cargado'}
            `

            //Formateamos desde AAAA-MM-DD a DD/MM/AAAA
            const fechaNacimientoString = cliente.fecha_nacimiento?.split('-').reverse().join('/') || 'Fecha de nacimiento desconocida';


            // const buscamos origen de dato
            const origenDato = await OrigenDato.findByPk(venta.origen_dato_id);


            const nuevaFila: NuevaFilaBboo = {
                "Marca temporal": `${empleado?.nombre.trim() || 'Nombre desconocido'}, ${empleado?.apellido.trim() || 'Apellido desconocido'} ${venta.fecha_realizacion || 'Fecha y horadesconocida'}`,
                "Vendedor": vendedor,
                "TIPO DE DOMICILIO": `${tipoDomicilio?.descripcion || 'Tipo de domicilio desconocido'}`,
                "Calle y Nro": domicilioString,
                "Entre Calles": entreCallesString,
                "Cliente Nombre y Apellido": `${cliente?.nombre.trim() || 'Nombre desconocido'}, ${cliente?.apellido.trim() || 'Apellido desconocido'}`,
                "Cliente DNI (Incluir la sigla LC o LE si no es DNI)": numeroDocumentoString,
                "Teléfono Cliente": `${telefono_principal}`,
                "LINEA CLARO A CONSULTAR (Todas las líneas PosPago masivo, ahora aplican a Convergencia, EXCLUYE LINEA FIJA) ": `${detalles.linea_claro_a_consultar || 'Linea claro a consultar no ingresada'}`,
                "PEDIDO RELLAMADO Ingresar DNI. Si es urgente agregar la palabra ALERTA": detalles.pedido_rellamado || 'Gigas desconocido',
            };


            // Tipo de negocio = 2 -> BAF
            await agregarFilaPorNombreColumnas(nuevaFila, venta.tipo_negocio_id);


        } catch (error) {
            throw new AppError('Error al cargar la nueva fila', 500);
        }
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),

            body('detalles.linea_claro_a_consultar')
                .optional({ checkFalsy: true })
                .isString().trim()
                .isLength({ max: 10, min: 10 })
                .matches(/^\d{10}$/).withMessage('El campo linea_claro_a_consultar debe ser una cadena de texto formada por 10 dígitos'),

            body('detalles.tipos_domicilios_id')
                .exists()
                .isInt({ min: 1 })
                .custom(async (tipos_domicilios_id, { req }) => {
                    const tipo_domicilio = await TipoDomicilio.findByPk(tipos_domicilios_id);
                    if (!tipo_domicilio) {
                        throw new AppError('El tipo de domicilio no existe', 400);
                    }
                }),

            body('detalles.pedido_rellamado')
                .optional()
                .isString().trim()
                .isLength({ max: 150, min: 1 })
        ]
    }



    //Agregamos fila


}

export default BbooStrategy;