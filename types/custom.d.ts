declare namespace Express {
    export interface Request {
        user: string;
        role: 'admin' | 'user';
    }
}