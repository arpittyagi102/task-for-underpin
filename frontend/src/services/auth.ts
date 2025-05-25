import { API_URL } from "@/utils/constants";

export async function signUp(data: SignUpPayload): Promise<AuthResponse> {
    try {
        const response = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        if (!response.ok || !result.token) {
            return {
                success: false,
                token: "",
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, token: result.token };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { success: false, message: error.message || "Network error", token: "" };
    }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (!response.ok || !result.token) {
            return {
                success: false,
                token: "",
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, token: result.token };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { success: false, message: error.message || "Network error", token: "" };
    }
}

type SignUpPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type AuthResponse = { success: boolean; token: string, message?: string }
