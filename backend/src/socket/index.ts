import { Server, Socket } from "socket.io";
import { updateBananaCount } from "../models/bananaService";

const users: Record<string, User> = {};

export const registerSocketHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {

        socket.on("auth", auth);
        socket.on("bananaClicked", bananaClicked);
        socket.on("qs-bananaCount", qsbananaCount);
        socket.on("disconnect", disconnect);

        // called when the user authenticates
        function auth (user: User) {
            if(users[socket.id]) {
                console.error("User already authenticated", users[socket.id]);
                return;
            }
            socket.data.user = user;
            users[socket.id] = user;
            console.log(user.firstName, "joined ✅");
        }

        // called when the user clicks on a banana
        function bananaClicked({ count }: { count: number }) {
            const user = users[socket.id];
            if (!user) {
                console.error("User not authenticated");
                return;
            }

            user.bananaCount = (user.bananaCount || 0) + count;
            console.log(`${user.firstName} clicked banana 🍌 New count: ${user.bananaCount}`);
            io.emit("bananaUpdated", { _id: user._id, bananaCount: user.bananaCount });

            if(!user.interval){
                user.interval = setTimeout(async () => {
                    await updateBananaCount(user._id, user.bananaCount);
                    user.interval = null; 
                    console.log(`Saved ${user.bananaCount} bananas for ${user.firstName}`);
                }, 5000);
            }
        }

        // called when the user requests their banana count
        function qsbananaCount() {
            const user = users[socket.id];
            if (!user) {
                console.error("User not authenticated for banana count query");
                return;
            }
            const bananaCount = user.bananaCount || 0;
            console.log(`${user.firstName} requested banana count: ${bananaCount}`);
            socket.emit("ans-bananaCount", { count: bananaCount });
        }

        // called when user disconnects
        async function disconnect() {
            const user = users[socket.id];
            if (!user) {
                console.error("User not authenticated on disconnect");
                return;
            }

            delete users[socket.id];
            console.log(`${user.firstName} disconnected ❌`);
        }
    });
};

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bananaCount: number;
    blocked?: boolean;
    createdAt?: string;
    interval: NodeJS.Timeout | null;
}
