import { io, Socket } from "socket.io-client";
import { API_URL } from "./constants";
import { User } from "@/types";

let socket: Socket | null = null;

export const initSocket = (user: User) => {
    if (!socket) {
        socket = io(API_URL, {
            withCredentials: true,
            autoConnect: false,
        });

        socket.on("connect", () => {
            if (user) {
                socket?.emit("auth", user);
            }
        });
    }

    return socket;
};

export const getSocket = () => socket;
