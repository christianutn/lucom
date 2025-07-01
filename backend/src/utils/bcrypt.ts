import bcrypt from 'bcrypt'
import "dotenv/config";

export const createHash = (password : string) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT || '10')))

export const validatePassword = (passwordSend : string, passwordBDD : string) => bcrypt.compareSync(passwordSend, passwordBDD)

