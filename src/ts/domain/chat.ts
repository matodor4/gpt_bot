
export class Chat {
    readonly telegramID: number
    readonly title: string
    readonly discription: string
    constructor(telegramID: number, title: string = "", discription:string = "") {
        this.telegramID = telegramID
        this.title = title
        this.discription = discription
    }
}