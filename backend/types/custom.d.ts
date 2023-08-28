declare namespace Express {
    export interface Request {
        user: {
            userId: any
            email: string;
            role: 'admin' | 'user';
        }
    }
}