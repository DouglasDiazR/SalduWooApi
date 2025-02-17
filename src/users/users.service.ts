import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
    getUsers(role?: string) {
        return this.usersRepository.getUsers(role)
    }

    getUsersProdFilter() {
        return this.usersRepository.getUsersProdFilter()
    }

    getUserByEmail(email: string) {
        return this.usersRepository.getUserByEmail(email)
    }
    getUserById(id: number) {
        return this.usersRepository.getUserById(id)
    }
}
