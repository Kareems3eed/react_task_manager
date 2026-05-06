import axiosInstance from "./axios";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    refresh: string;
    access: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/token/", data);
    return response.data;
};