import { Users } from 'src/entities/users.entity'

declare global {
    namespace Express {
        interface Request {
            user: Users
        }
    }
}
