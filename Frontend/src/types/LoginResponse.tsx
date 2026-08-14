export interface LoginResponse {

    message: string;

    token: string;

    user: {

        id: string;

        fullName: string;

        email: string;

        role: string;
    };
}