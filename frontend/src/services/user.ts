import { API_URL } from "@/utils/constants";
import { User } from "@/types";

export async function getAllUsers(): Promise<{
    success: boolean;
    users?: User[];
    message?: string;
}> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, message: "Not authenticated" };
        }

        const response = await fetch(API_URL + "/api/users", {
            headers: {
                Authorization: token,
            },
        });
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, users: result.users };
    } catch (error: any) {
        return { success: false, message: error.message || "Network error" };
    }
}

export async function deleteUser(
    userId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, message: "Not authenticated" };
        }

        const response = await fetch(API_URL + `/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, message: result.message };
    } catch (error: any) {
        return { success: false, message: error.message || "Network error" };
    }
}

export async function toggleBlockUser(
    userId: string,
    blocked: boolean
): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, message: "Not authenticated" };
        }

        const response = await fetch(API_URL + `/api/users/${userId}/block`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ blocked }),
        });
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, user: result.user };
    } catch (error: any) {
        return { success: false, message: error.message || "Network error" };
    }
}

export const createUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}) => {
    try {
        const response = await fetch(API_URL + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return {
            success: response.ok,
            user: data.user,
            message: data.message,
        };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            message: "Failed to create user",
        };
    }
};

export const updateUser = async (
    userId: string,
    userData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        role?: string;
    }
) => {
    try {
        const response = await fetch(API_URL + `/api/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") || "",
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return {
            success: response.ok,
            user: data.user,
            message: data.message,
        };
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: "Failed to update user",
        };
    }
};
