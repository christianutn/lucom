import { Router } from 'express';
import abonoRouter from './abono.routes.js';
import barrioRouter from './barrio.routes.js';
import authRouter from './auth.routes.js';
import clienteRouter from './cliente.routes.js';
import companiaRouter from './compania.routes.js';
import datoServicioConvergenciaRouter from './dato_servicio_convergencia.routes.js'
import detalleBaf from './detalle_baf.routes.js'


const router = Router();

router.use('/abonos', abonoRouter);
router.use('/barrios', barrioRouter);
router.use('/auth', authRouter);
router.use('/clientes', clienteRouter);
router.use('/companias', companiaRouter);
router.use('/datos-servicios-convergencias', datoServicioConvergenciaRouter);
router.use('/detalles-baf', detalleBaf);


export default router;