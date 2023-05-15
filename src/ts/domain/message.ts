import { messageFrom, messageType } from "@prisma/client";



export class Message {
    readonly text: string
    readonly chatID: number
    readonly userID: number
    readonly msgFrom:messageFrom
    readonly msgType:messageType
    
    constructor(text: string, chatID: number, userID: number, msgFrom: messageFrom, msgType: messageType) {
        this.text = text
        this.chatID = chatID
        this.msgFrom = msgFrom
        this.userID = userID
        this.msgType = msgType
    }

}