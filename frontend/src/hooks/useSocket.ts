import { useEffect, useRef } from "react";
import { initSocket } from "@/utils/socket";
import { User } from "@/types";

export const useSocket = (user: User|null, isAuthenticated: boolean) => {
    const socketRef = useRef<User>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            const socket = initSocket(user);
            socketRef.current = socket;

            if (!socket.connected) socket.connect();

            return () => {
                socket.disconnect();
            };
        }
    }, [isAuthenticated, user]);

    return socketRef.current;
};
