export class User {
    telegramID;
    name;
    constructor(telegramID, name) {
        this.telegramID = telegramID;
        this.name = name;
    }
}
export function UserFromDTO(dto) {
    return new User(dto.telegramID, dto.name);
}
