import 'dotenv/config'
import jwt from 'jsonwebtoken'
import AppError from './appError.js'

const generateToken = (user) => {

    try {
        /*
        1° parametro: Objeto asociado al token (Usuario)
        2° parametro: Clave privada para el cifrado
        3° parametro: Tiempo de expiracion
    */

        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' })

        return token
    } catch (error) {
        throw new AppError('Error al generar token', 500)

    }

}

export default generateToken