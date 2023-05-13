export class Chat {
    telegramID;
    title;
    discription;
    constructor(telegramID, title = "", discription = "") {
        this.telegramID = telegramID;
        this.title = title;
        this.discription = discription;
    }
}
