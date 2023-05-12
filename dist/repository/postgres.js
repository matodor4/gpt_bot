import { PrismaClient } from '@prisma/client';
import { UserFromDTO } from "../domain/user.js";
export class UserRepository {
    client;
    constructor() {
        this.client = new PrismaClient();
    }
    close() {
        this.client.$disconnect();
    }
    async GetUser(id) {
        const userDTO = await this.client.user.findFirst({
            where: {
                id: id
            }
        });
        if (userDTO === undefined) {
            const error = new Error("failed to find user");
            this.close();
            return Promise.resolve([null, error]);
        }
        if (userDTO === null) {
            this.close();
            return Promise.resolve([null, null]);
        }
        this.close();
        return Promise.resolve([UserFromDTO(userDTO), null]);
    }
    async SaveUser(user) {
        const userDTO = await this.client.user.create({ data: {
                name: user.name,
                telegramID: user.telegramID
            } });
        if (userDTO === undefined) {
            const error = new Error("failed to save user");
            this.close();
            return Promise.resolve([null, error]);
        }
        this.close();
        return Promise.resolve([UserFromDTO(userDTO), null]);
    }
    async UpdateUser(user) {
        const userDTO = await this.client.user.update({
            where: {
                telegramID: user.telegramID
            },
            data: {
                name: user.name,
            }
        });
        if (userDTO === undefined) {
            const error = new Error("failed to update user");
            this.close();
            return Promise.resolve([null, error]);
        }
        this.close();
        return Promise.resolve([UserFromDTO(userDTO), null]);
    }
    async DeleteUser(telegramID) {
        const deletedUser = await this.client.user.delete({
            where: {
                telegramID: telegramID,
            }
        });
        if (deletedUser === undefined) {
            const error = new Error("failed to delete user");
            this.close();
            return Promise.resolve([null, error]);
        }
        this.close();
        return Promise.resolve([null, null]);
    }
}
