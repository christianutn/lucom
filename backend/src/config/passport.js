import passport from 'passport';
import passportLocal from 'passport-local';
import Usuario from "../models/usuario.models.js"
import { validatePassword } from "../utils/bcrypt.js"
import jwt from 'passport-jwt'
import 'dotenv/config';
import Empleado from '../models/empleado.models.js';
import AppError from '../utils/appError.js';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token


const inicializarPassport = () => {


    const cookieExtractor = req => {


        // Tomamos el token de los headers de autorización, si existe
        let token = req.headers.authorization ? req.headers.authorization : '';

        // Verificamos si el token es una cadena y si comienza con 'Bearer '
        if (typeof token === 'string' && token.startsWith('Bearer ')) {
            // Si es así, eliminamos la palabra 'Bearer ' del inicio
            token = token.slice(7, token.length);
        }

        return token;

    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //El token va a venir desde cookieExtractor
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
        try {

            return done(null, jwt_payload)
        } catch (error) {
            
            return done(error)
        }

    }))

    passport.use("login", new LocalStrategy({
        usernameField: 'empleado_id', // Cambia esto al campo que usas para el nombre de usuario
        passwordField: 'contrasena', // Cambia esto al campo que usas para la contraseña
        passReqToCallback: true //Opción para tomar datos del body
    }, async function (req, empleado_id, contrasena, done) {
        // Login
        try {

            const usuario = await Usuario.findOne({ where: { empleado_id: empleado_id } });
            if (!usuario) {

                done(null, false);
            }

            // No se permite loguear usuario que no están activos
            if (!usuario.activo) {
                done(null, false);
            }

            if (!validatePassword(String(contrasena), usuario.contrasena)) {

                done(null, false);
            }

            const empelado = await Empleado.findOne({ where: { id: empleado_id } });
            if (!empelado) {
                done(null, false);
            }

            const datosUsuario = { ...usuario.dataValues, nombre: empelado.nombre, apellido: empelado.apellido } //Unifico los datos del usuario y de la persona para que se guarde en la sesión

            done(null, datosUsuario); //Devuelvo el usuario y la persona para que se guarde en la sesión;
        } catch (error) {
            done(error)
        }
    }));

}

export default inicializarPassport