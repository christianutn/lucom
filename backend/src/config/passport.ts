import passport from 'passport';
import passportLocal from 'passport-local';
import Usuario from "../models/usuario.models.js"
import { validatePassword } from "../utils/bcrypt.js"
import jwt from 'passport-jwt'
import 'dotenv/config';
import Empleado from '../models/empleado.models.js';
import AppError from '../utils/appError.js';
import { Request, Response, NextFunction } from 'express';
import { IUserInRequest } from '../types/usuario.d.js';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token




const inicializarPassport = () => {

    //Validamos variables de entorno
    if (!process.env.JWT_SECRET) {
        throw new AppError('Falta la variable de entorno JWT_SECRET', 500);
    }
    const cookieExtractor = (req: Request) => {


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
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { // jwt_payload ahora es { sub: 123, rol: 'admin' }
        try {
            // --- CAMBIO CLAVE: BUSCAR AL USUARIO EN LA BASE DE DATOS ---
            // Usamos el 'sub' (ID) del payload para encontrar al usuario.
            const usuarioDb = await Usuario.findByPk(jwt_payload.sub);

            // Si el usuario no existe en la BD o está inactivo, rechazamos.
            if (!usuarioDb || !usuarioDb.activo) {
                return done(null, false);
            }

            // Ahora, buscamos los datos complementarios del empleado.
            const empleadoDb = await Empleado.findByPk(usuarioDb.empleado_id);
            if (!empleadoDb) {
                return done(null, false);
            }

            // Construimos el objeto plano que queremos para `req.user`
            const usuarioParaRequest: IUserInRequest = {
                empleado_id: usuarioDb.empleado_id,
                rol: usuarioDb.rol,
                activo: usuarioDb.activo,
                nombre: empleadoDb.nombre,
                apellido: empleadoDb.apellido
            };

            // Pasamos este objeto recién creado y garantizado como plano.
            // Passport lo asignará a `req.user`.
            return done(null, usuarioParaRequest);

        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: 'empleado_id', // Cambia esto al campo que usas para el nombre de usuario
        passwordField: 'contrasena', // Cambia esto al campo que usas para la contraseña
        passReqToCallback: true //Opción para tomar datos del body
    }, async function (req, empleado_id, contrasena, done) {
        // Login
        try {

            const usuario = await Usuario.findByPk(empleado_id)

            if (!usuario) {

                done(null, false);
                return;
            }

            // No se permite loguear usuario que no están activos
            if (!usuario || !usuario.activo) {
                done(null, false);
                return;
            }

            if (!validatePassword(String(contrasena), usuario.contrasena)) {

                done(null, false);
                return;
            }

            const empelado = await Empleado.findByPk(usuario.empleado_id)
            if (!empelado) {
                done(null, false);
                return;
            }

            const datosUsuario: IUserInRequest = {
                ...{
                    empleado_id: empelado.id,
                    rol: usuario.rol,
                    activo: usuario.activo,
                },
                nombre: empelado.nombre,
                apellido: empelado.apellido,
            } //Unifico los datos del usuario y de la persona para que se guarde en la sesión

            done(null, datosUsuario); //Devuelvo el usuario y la persona para que se guarde en la sesión;
        } catch (error) {
            done(error)
        }
    }));

}

export default inicializarPassport