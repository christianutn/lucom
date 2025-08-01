import { Router } from 'express';
import abonoRouter from './abono.routes.js';
import barrioRouter from './barrio.routes.js';
import authRouter from './auth.routes.js';
import clienteRouter from './cliente.routes.js';
import companiaRouter from './compania.routes.js';
import datoServicioConvergenciaRouter from './dato_servicio_convergencia.routes.js'
import detalleBaf from './detalle_baf.routes.js'
import detallePortaRouter from './detalle_porta.routes.js'
import domicilioRouter from './domicilio.routes.js';
import empleadoRouter from './empleado.routes.js';
import gigaRouter from './giga.routes.js';
import origenDatoRouter from './origen_dato.routes.js';
import rolRouter from './rol.routes.js';
import tipoConvergenciaRouter from './tipo_convergencia.routes.js';
import tipoDomicilioRouter from './tipo_domicilio.routes.js';
import tipoNegocioRouter from './tipo_negocio.routes.js';
import usuarioRouter from './usuario.routes.js';
import ventaRouter from './venta.routes.js';
import tipoDocumentoRouter from './tipo_documento.routes.js';
import detalleBbooRouter from './detalle_bboo.routes.js';

const router = Router();

router.use('/abonos', abonoRouter);
router.use('/barrios', barrioRouter);
router.use('/auth', authRouter);
router.use('/clientes', clienteRouter);
router.use('/companias', companiaRouter);
router.use('/datos-servicios-convergencias', datoServicioConvergenciaRouter);
router.use('/detalles-baf', detalleBaf);
router.use('/detalles-porta', detallePortaRouter);
router.use('/domicilios', domicilioRouter);
router.use('/empleados', empleadoRouter);
router.use('/gigas', gigaRouter);
router.use('/origen-datos', origenDatoRouter);
router.use('/roles', rolRouter);
router.use('/tipos-convergencias', tipoConvergenciaRouter);
router.use('/tipos-domicilios', tipoDomicilioRouter);
router.use('/tipos-negocios', tipoNegocioRouter);
router.use('/usuarios', usuarioRouter);
router.use('/ventas', ventaRouter);
router.use('/tipos-documentos', tipoDocumentoRouter);
router.use('/detalles-bboo', detalleBbooRouter);

export default router; 