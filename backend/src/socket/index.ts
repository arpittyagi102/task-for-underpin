import { Server, Socket } from "socket.io";
import { updateBananaCount } from "../models/bananaService";
import { Types } from "mongoose";

interface User {
    _id: string; // or Types.ObjectId
    username?: string;
}

interface Session {
    interval: NodeJS.Timeout;
    user: User;
}

const idToBananaCount: Record<string, number> = {};
const socketSessions: Map<string, Session> = new Map();

export const registerSocketHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {

        socket.on("auth", (user: User) => {
            console.log("User authenticated:", user);
            socket.data.user = user;

            socketSessions.set(socket.id, {
                user,
                interval: setInterval(() => {
                    const count = idToBananaCount[socket.id] || 0;
                    if (count > 0) {
                        updateBananaCount(user._id, count);
                        idToBananaCount[socket.id] = 0;
                    }
                }, 5000),
            });
        });

        socket.on("bananaClicked", ({ count }) => {
            idToBananaCount[socket.id] = (idToBananaCount[socket.id] || 0) + count;
            console.log("Banana clicked")
            io.emit("bananaUpdate", { userId: socket.id, count: idToBananaCount[socket.id] });
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);
            const session = socketSessions.get(socket.id);
            if (session) {
                clearInterval(session.interval);

                const finalCount = idToBananaCount[socket.id] || 0;
                if (finalCount > 0) {
                    await updateBananaCount(session.user._id, finalCount);
                }

                socketSessions.delete(socket.id);
                delete idToBananaCount[socket.id];
            }
        });
    });
};
