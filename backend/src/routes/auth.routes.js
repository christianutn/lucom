import { postLogin } from '../controllers/auth.controller.js'
import { Router } from "express";
import passport from 'passport';
import limitarIntentos from '../utils/limitarIntentos.js';
import { check } from "express-validator";
import manejerValidacionErrores from '../middlewares/manejarValidacionErrores.js';

const router = Router();

router.post('/login', limitarIntentos, [
    check('empleado_id').isInt({ min: 1 }),
    check('contrasena').isLength({ min: 4 })
],
    manejerValidacionErrores,
    passport.authenticate('login', { session: false }), postLogin);

export default router;