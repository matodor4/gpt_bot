import { PrismaClient, messageFrom, messageType } from "@prisma/client";
import { Message } from "../domain/message.js";
import { User } from "../domain/user.js";
import { PairPromiseResult } from "./user_repositoty.js";



export class MessageRepository {
    private client: PrismaClient
    constructor(client: PrismaClient) {
        this.client = client
    }

    public async SaveMessage(msg:Message): Promise<null|Error> {
        const createMsg = await this.client.message.create({
            data: {
                from: msg.msgFrom,
                type: msg.msgType,
                fromUser: { connect: { telegramID: msg.userID } },
                chatID: msg.chatID,
                body: msg.text,
            }
        })
        if (createMsg === undefined) {
            const error = new Error("failed to save message")

            return error
        }


        return null
    }

    public async GetMesageByID(messageID: string) {
        const findMsg = await this.client.message.findFirst({
            where: {
                id: messageID
            }
        })
        if (findMsg === undefined) {
            const error = new Error("failed to find message")

            return Promise.resolve([null, error])
        }
        return Promise.resolve([findMsg, null])
    }
}