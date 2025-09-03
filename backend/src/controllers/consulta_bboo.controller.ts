
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { IConsultaBbooAttributes, IConsultaBbooCreate, IConsultaBbooUpdate } from "../types/consultas_bboo.js";
import ConsultaBboo from "../models/consulta_bboo.js";
import { DateTime } from "luxon";
import { IUserInRequest } from "../types/usuario.js"
import { IClienteAttributes} from "../types/cliente.js";
import { IDomicilioAttributes } from "../types/domicilio.js";
import { IBarrioAttributes } from "../types/barrio.js";
import { Op, WhereOptions, Transaction } from "sequelize";
import { tratarCliente, tratarDomicilio, tratarBarrio} from "../controllers/venta.controller.js"
import { agregarFilaPorNombreColumnas } from "../googleSheets/cargarDatosBAF.js";
import { NuevaFilaBboo } from "../types/googleSheets.js";
import Empleado from "../models/empleado.models.js";
import TipoDocumento from "../models/tipo_documento.models.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import sequelize from "../config/base_datos.js";




export const getConsultasBboo = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { linea_claro_a_consultar, tipos_domicilios_id } = req.query;
        const where: WhereOptions<IConsultaBbooAttributes> = {};

        if (linea_claro_a_consultar) where.linea_claro_a_consultar = parseInt(linea_claro_a_consultar as string, 10);
        if (tipos_domicilios_id) where.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);


        const consultaBboo = await ConsultaBboo.findAll({
            where
        });

        res.status(200).json(consultaBboo);

    } catch (error) {
        return next(new AppError('Error al obtener los Consulta de BBOO', 500));
    }
};

export const getConsultaBbooPorID = async (req: Request, res: Response, next: NextFunction) => {
    const { venta_id } = req.params;
    try {
        const consultaBboo = await ConsultaBboo.findByPk(venta_id);
        if (!consultaBboo) {
            return next(new AppError(`ConsultaBboo con ID ${venta_id} no encontrado`, 404));
        }
        res.status(200).json(consultaBboo);
    } catch (error) {
        return next(new AppError('Error al obtener el ConsultaBboo', 500));
    }
};

export const crearConsultaBboo = async (req: Request, res: Response, next: NextFunction) => {

    // Cargamos los datos del body de la solicitud
    const detalles: IConsultaBbooCreate = req.body.detalles;
    const cliente: IClienteAttributes = req.body.cliente;
    const domicilio: IDomicilioAttributes = req.body.domicilio;
    const barrio: IBarrioAttributes = req.body.barrio;



    const usuario: IUserInRequest | null = req.user as IUserInRequest;



    // Iniciamos una transacción controlada por Sequelize
    const t: Transaction = await sequelize.transaction();

    try {

        
        const sanitizedDetalles = Object.fromEntries(Object.entries(detalles).filter(([, value]) => value !== ''));
        await ConsultaBboo.create(sanitizedDetalles as IConsultaBbooCreate, { transaction: t });

        //Cargar nueva fila en googlesheets


        await cargar_nueva_fila(detalles, cliente, domicilio, barrio, usuario);

        // 7. Confirmar la transacción
        await t.commit();

        res.status(201).json({message: "Consulta BBOO creada con éxito"});

    } catch (error) {
        await t.rollback(); // Si algo falla, revertir todo

        next(new AppError('Error al crear la venta', 500));
    }
};


// export const actualizarConsultaBboo = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const venta_id = parseInt(req.params.venta_id as string, 10);

//         const ConsultaBbooActualizado: IConsultaBbooUpdate = {};


//         const { linea_claro_a_consultar, pedido_rellamado, tipos_domicilios_id } = req.body;

//         // Parsear datos y asignar a objeto de actualización
//         if (linea_claro_a_consultar) ConsultaBbooActualizado.linea_claro_a_consultar = linea_claro_a_consultar as string;
//         if (pedido_rellamado) ConsultaBbooActualizado.pedido_rellamado = pedido_rellamado as string;
//         if (tipos_domicilios_id) ConsultaBbooActualizado.tipos_domicilios_id = parseInt(tipos_domicilios_id as string, 10);

//         // validar que se haya enviado al menos un campo para actualizar
//         if (Object.keys(ConsultaBbooActualizado).length === 0) {
//             res.status(200).json({ message: 'No hubo atributos para actualizar ConsultaBboo' });
//             return;
//         }



//         // Validar que al menos un campo sea haya enviado una propiedad para actualizar
//         if (Object.keys(ConsultaBbooActualizado).length === 0) {
//             res.status(200).json({ message: 'No hubo atributos para actualizar ConsultaBboo' });
//             return;
//         }


//         // Ejecutar el update
//         const [actualizado] = await ConsultaBboo.update(ConsultaBbooActualizado, {
//             where: { venta_id: venta_id }
//         });

//         if (actualizado === 0) {
//             res.status(200).json({ message: 'No hubo atributos para actualizar o el ConsultaBaf no existe ConsultaBboo' });
//             return;
//         }

//         const ConsultaBafModificado = await ConsultaBboo.findByPk(venta_id);

//         res.status(200).json(ConsultaBafModificado);
//     } catch (error) {
//         return next(new AppError('Error al actualizar el ConsultaBboo', 500));
//     }
// };


const cargar_nueva_fila = async (detalles: IConsultaBbooCreate, cliente: IClienteAttributes, domicilio: IDomicilioAttributes, barrio: IBarrioAttributes, user: IUserInRequest) => {
    try {

        // Buscamos empleados por empleado_id en user
        const empleado = await Empleado.findByPk(user?.empleado_id);

        if (!empleado) {
            throw new AppError('Empleado no encontrado', 404);
        }



        //Buscamos tipo de documento
        let tipoDocumento = null;
        if(cliente.tipo_documento){
            tipoDocumento = await TipoDocumento.findByPk(cliente.tipo_documento);
        }

        // Armamos string de contacto

        const telefono_principal = cliente.telefono_principal;

        // Armamos string para Vendedor

        const vendedor = `${empleado.alias || 'Nombre desconocido'}`

        //armamos dni
        const numeroDocumentoString = `${tipoDocumento?.descripcion || ''}:  ${cliente.numero_documento.trim() || 'Documento desconocido'}`

        // Buscamos tipo de domiclio
        const tipoDomicilio = await TipoDomicilio.findByPk(detalles.tipos_domicilios_id);

        //armamos string con entrecalles
        let entreCallesString = `${domicilio.entre_calle_1 || 'No ingresado'} / ${domicilio.entre_calle_2 || 'No ingresado'}`
        if (!domicilio.entre_calle_1 && !domicilio.entre_calle_2) {
            entreCallesString = "No ingresado"
        }
        //Aramamos string del domicilio



        const piso = domicilio.piso ? ` - Piso: ${domicilio.piso}` : '';
        const departamento = domicilio.departamento ? ` - Dpto: ${domicilio.departamento}` : '';
        const entreCalles = domicilio.entre_calle_1 || domicilio.entre_calle_2 ? ` - Entre calles: ${domicilio.entre_calle_1 || 'No ingresada'} / ${domicilio.entre_calle_2 || 'No ingresada'}` : '';
        const barrioString = barrio.nombre ? ` - Barrio: ${barrio.nombre}` : '';
        const domicilioString = `${domicilio.nombre_calle?.trim() || ''} ${domicilio.numero_calle || ''}${piso}${departamento}${entreCalles}${barrioString}`;
        //Formateamos fecha_de_realizacion ejemplo 2/1/2024 10:33:03
        const fecha_realizacion = obtenerFechaHoraActual();


        const nuevaFila: NuevaFilaBboo = {
            "Marca temporal": `${fecha_realizacion}`,
            "Vendedor": vendedor,
            "TIPO DE DOMICILIO": `${tipoDomicilio?.descripcion || 'Tipo de domicilio desconocido'}`,
            "Calle y Nro": domicilioString,
            "Entre Calles": entreCallesString,
            "Cliente Nombre y Apellido": `${cliente?.nombre.trim() || 'Nombre desconocido'}, ${cliente?.apellido.trim() || 'Apellido desconocido'}`,
            "Cliente DNI (Incluir la sigla LC o LE si no es DNI)": numeroDocumentoString,
            "Teléfono Cliente": `${telefono_principal}`,
            "LINEA CLARO A CONSULTAR (Todas las líneas PosPago masivo, ahora aplican a Convergencia, EXCLUYE LINEA FIJA) ": `${detalles.linea_claro_a_consultar || 'Linea claro a consultar no ingresada'}`,
            "PEDIDO RELLAMADO Ingresar DNI. Si es urgente agregar la palabra ALERTA": detalles.pedido_rellamado || 'No ingresado',
        };


        // Tipo de negocio = 2 -> BAF
        await agregarFilaPorNombreColumnas(nuevaFila, 3);


    } catch (error) {
        throw new AppError('Error al cargar la nueva fila', 500);
    }

}


function obtenerFechaHoraActual() {
    const ahora = new Date();

    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const anio = ahora.getFullYear();

    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
}
