export class User {
    telegramID;
    name;
    isBot;
    languageCode;
    constructor(telegramID, name, langCode, isBot) {
        this.telegramID = telegramID;
        this.name = name;
        this.isBot = isBot;
        this.languageCode = langCode;
    }
}
export function UserFromDTO(dto) {
    return new User(dto.telegramID, dto.name, "ru", false);
}
