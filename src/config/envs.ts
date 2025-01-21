import { config } from 'dotenv'
config()

export const PORT = process.env.PORT
export const PORT_FRONT = process.env.PORT_FRONT
export const WOOAPI_KEY = process.env.WOOAPI_KEY
export const WOOAPI_SECRET = process.env.WOOAPI_SECRET
export const WOOAPI_USER = process.env.WOOAPI_USER
export const WOOAPI_URL = process.env.WOOAPI_URL

export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT

export const JWT_SECRET = process.env.JWT_SECRET

export const SIIGO_AUTH_URL = process.env.SIIGO_AUTH_URL
export const SIIGO_API_URL = process.env.SIIGO_API_URL
export const SIIGO_USERNAME = process.env.SIIGO_USERNAME_PROD
export const SIIGO_ACCESSKEY = process.env.SIIGO_ACCESSKEY_PROD
export const SIIGO_PARTNERID = process.env.SIIGO_PARTNERID

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
export const AWS_REGION = process.env.AWS_REGION