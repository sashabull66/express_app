declare namespace Express {
    export interface Request {
        user: {
            id: any
            email: string;
            role: 'admin' | 'user';
        }
    }
}