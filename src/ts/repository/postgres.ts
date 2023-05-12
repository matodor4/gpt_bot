import {PrismaClient} from '@prisma/client'
import {User, UserFromDTO} from "../domain/user.js"

type PairPromiseResult<U> = Promise<[U, null] | [null, Error] | [null, null]>;

export class UserRepository {
    private client: PrismaClient

    constructor() {
        this.client = new PrismaClient()
    }

    private close() {
        this.client.$disconnect()
    }

    public async GetUser(id: string): PairPromiseResult<User> {
        const userDTO = await this.client.user.findFirst({
            where: {
                id: id
            }
        })
        if (userDTO === undefined) {
            const error = new Error("failed to find user")
            this.close()

            return Promise.resolve([null, error])
        }

        if (userDTO === null) {
            this.close()

            return Promise.resolve([null, null])
        }
        this.close()


        return Promise.resolve([UserFromDTO(userDTO), null])
    }

    public async SaveUser(user:User):PairPromiseResult<User> {
        const userDTO = await this.client.user.create({data:{
                name: user.name,
                telegramID: user.telegramID
            }})
        if (userDTO === undefined) {
            const error = new Error("failed to save user")
            this.close()

            return Promise.resolve([null, error])
        }
        this.close()

        return Promise.resolve([UserFromDTO(userDTO), null])
    }

    public async UpdateUser(user:User):PairPromiseResult<User> {
        const userDTO = await this.client.user.update({
            where:{
                telegramID: user.telegramID
            },
            data: {
                name: user.name,
            }
        })
        if (userDTO === undefined) {
            const error = new Error("failed to update user")
            this.close()

            return Promise.resolve([null, error])
        }
        this.close()

        return Promise.resolve([UserFromDTO(userDTO), null])
    }
    public async DeleteUser(telegramID:string):PairPromiseResult<User> {
        const deletedUser = await this.client.user.delete({
            where: {
                telegramID: telegramID,
            }
        })
        if (deletedUser === undefined) {
            const error = new Error("failed to delete user")
            this.close()

            return Promise.resolve([null, error])
        }
        this.close()

        return Promise.resolve([null, null])
    }
}



