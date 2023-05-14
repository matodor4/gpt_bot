export class Message {
    text;
    chatID;
    userID;
    msgFrom;
    msgType;
    constructor(text, chatID, userID, msgFrom, msgType) {
        this.text = text;
        this.chatID = chatID;
        this.msgFrom = msgFrom;
        this.userID = userID;
        this.msgType = msgType;
    }
}
