import { messageFrom, messageType } from "@prisma/client";
export class MessageRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async SaveMessage(user, message, msgType, chatID) {
        const createMsg = await this.client.message.create({
            data: {
                number: message.number,
                from: messageFrom.USER,
                type: messageType.TEXT,
                fromUser: { connect: { telegramID: user.telegramID } },
                chatID: chatID,
                body: message.text,
            }
        });
        if (createMsg === undefined) {
            const error = new Error("failed to save message");
            return Promise.resolve([null, error]);
        }
        return Promise.resolve([createMsg, null]);
    }
    async GetMesageByID(messageID) {
        const findMsg = await this.client.message.findFirst({
            where: {
                id: messageID
            }
        });
        if (findMsg === undefined) {
            const error = new Error("failed to find message");
            return Promise.resolve([null, error]);
        }
        return Promise.resolve([findMsg, null]);
    }
}
