import {PrismaClient} from '@prisma/client'
import {User, UserFromDTO} from "../domain/user.js"

export type PairPromiseResult<U> = Promise<[U, null] | [null, Error] | [null, null]>;

export class UserRepository {
    private client: PrismaClient

    constructor(client:PrismaClient) {
        this.client = client
    }

    public async GetUser(telegramID: number): PairPromiseResult<User> {
        const userDTO = await this.client.user.findFirst({
            where: {
                telegramID: telegramID
            }
        })
        if (userDTO === undefined) {
            const error = new Error("failed to find user")
            

            return Promise.resolve([null, error])
        }

        if (userDTO === null) {
            

            return Promise.resolve([null, null])
        }
        


        return Promise.resolve([UserFromDTO(userDTO), null])
    }

    public async SaveUser(user:User):Promise<null | Error> {
        const userDTO = await this.client.user.create({data:{
                name: user.name,
                telegramID: user.telegramID
            }})
        if (userDTO === undefined) {
            const error = new Error("failed to save user")
            

            return error
        }
        

        return null
    }

    public async SaveIfNotExist(user:User):Promise<null | Error> {
        const userDTO = await this.client.user.upsert({
            where: {
                telegramID: user.telegramID
            },
            create: {
                telegramID: user.telegramID,
                name: user.name
            },
            update: {
                name: user.name
            }
        })
        if (userDTO === undefined) {
            const error = new Error("failed to save user")
            

            return error
        }
        

        return null
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
            

            return Promise.resolve([null, error])
        }
        

        return Promise.resolve([UserFromDTO(userDTO), null])
    }
    public async DeleteUser(telegramID:number):PairPromiseResult<User> {
        const deletedUser = await this.client.user.delete({
            where: {
                telegramID: telegramID,
            }
        })
        if (deletedUser === undefined) {
            const error = new Error("failed to delete user")
            

            return Promise.resolve([null, error])
        }
        

        return Promise.resolve([null, null])
    }
}



