export interface IRequestCreateUser {
    name: string;
    email: string;
    password: string;
}

export interface IResponseUser {
    id: string;
    name: string;
    email: string;
    password: string;
}
