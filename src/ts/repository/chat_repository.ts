import { PrismaClient} from "@prisma/client"
import { PairPromiseResult } from "./user_repositoty.js"

import { Chat } from "../domain/chat.js"

export class ChatRepository {
    private client: PrismaClient

    constructor(client:PrismaClient) {
        this.client = client
    }


    public async Save(chat: Chat): Promise<null | Error> {
        const savedChat = await this.client.dialog.upsert({
            where: {
                chatID: chat.telegramID,
            },
            create: {
                chatID: chat.telegramID,
                title: "default title",
                discription: "default description"
            },
            update: {
                title: chat.title,
                discription: chat.discription
            }
        })
        if (savedChat === undefined) {
            const error = new Error("failed to save user")

            return savedChat
        }

        return null
    }
    public async Delete(id: number): PairPromiseResult<Chat> {
        const deletedChat = await this.client.dialog.delete(
            {
                where: {
                    chatID: id
                }
            }
        )
        if (deletedChat === undefined) {
            return Promise.resolve([null, new Error("failed to delete chat")])
        }

        return Promise.resolve([null, null])
    }
    public async Update(chat:Chat): PairPromiseResult<Chat> {
        const updatedChat = await this.client.dialog.update({
            where: {
                chatID: chat.telegramID
            },
            data: {
                title: chat.title,
                discription: chat.discription
            }
        })
        if (updatedChat === undefined) {
            return Promise.resolve([null, new Error("failed to update chat")])
        }
        if (updatedChat === null) {
            return Promise.resolve([null, new Error("chat not found")])
        }

        const newChat = new Chat(updatedChat.chatID, updatedChat.title ?? "", updatedChat.discription ?? "")
        return Promise.resolve([newChat, null])
        
    }
}