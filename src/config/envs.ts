import { config } from 'dotenv'
config()

export const PORT = process.env.PORT
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
