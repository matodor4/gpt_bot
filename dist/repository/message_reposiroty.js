export class MessageRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async SaveMessage(msg) {
        const createMsg = await this.client.message.create({
            data: {
                from: msg.msgFrom,
                type: msg.msgType,
                fromUser: { connect: { telegramID: msg.userID } },
                chatID: msg.chatID,
                body: msg.text,
            }
        });
        if (createMsg === undefined) {
            const error = new Error("failed to save message");
            return error;
        }
        return null;
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
