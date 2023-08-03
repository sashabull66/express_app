import pk from "bcryptjs";

export class UserEntity {
    private _password: string;
    constructor(
        private readonly _email: string,
        private readonly _name: string,
        private readonly _role: 'admin' | 'user'
    ) {}

    get email(): string {
        return this._email
    }

    get name(): string {
        return this._name
    }

    get role(): 'admin' | 'user' {
        return this._role
    }

    get password(): string {
        return  this._password
    }

    public async setPassword(password: string, salt: string): Promise<void> {
        this._password = await pk.hash(password, Number(salt));
    }
}