import { io, Socket } from "socket.io-client";
import { API_URL } from "./constants";
import { User } from "@/types";

let socket: Socket | null = null;

export const initSocket = (user: User) => {
    console.log("initSocket called with user:", user);
    if (!socket || !socket.connected) {
        socket = io(API_URL, {
            withCredentials: true,
            autoConnect: false,
        });

        socket.on("connect", () => {
            console.log("Socket connection ? ", socket?.connected);
            if (user) {
                socket?.emit("auth", user);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    }

    return socket;
};

export const getSocket = () => socket;
