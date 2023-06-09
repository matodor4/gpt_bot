import { messageType } from "@prisma/client";
import { Message } from "../domain/message.js";
export class MessageRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async SaveMessage(user, message, msgFrom, chatID) {
        const createMsg = await this.client.message.create({
            data: {
                from: msgFrom,
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
        const msg = new Message(createMsg.body, chatID);
        return Promise.resolve([msg, null]);
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
