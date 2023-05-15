import { UserFromDTO } from "../domain/user.js";
export class UserRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async GetUser(telegramID) {
        const userDTO = await this.client.user.findFirst({
            where: {
                telegramID: telegramID
            }
        });
        if (userDTO === undefined) {
            const error = new Error("failed to find user");
            return Promise.resolve([null, error]);
        }
        if (userDTO === null) {
            return Promise.resolve([null, null]);
        }
        return Promise.resolve([UserFromDTO(userDTO), null]);
    }
    async SaveUser(user) {
        const userDTO = await this.client.user.create({ data: {
                name: user.name,
                telegramID: user.telegramID
            } });
        if (userDTO === undefined) {
            const error = new Error("failed to save user");
            return error;
        }
        return null;
    }
    async SaveIfNotExist(user) {
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
        });
        if (userDTO === undefined) {
            const error = new Error("failed to save user");
            return error;
        }
        return null;
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
            return Promise.resolve([null, error]);
        }
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
            return Promise.resolve([null, error]);
        }
        return Promise.resolve([null, null]);
    }
}
