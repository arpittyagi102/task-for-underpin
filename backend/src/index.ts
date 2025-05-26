import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import connectDB from "./utils/mongoose";
import { checkENV } from "./utils/lib";
import { FRONTEND_URL } from "./utils/constants";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket";

dotenv.config({ path: ".env.local" });
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

checkENV();
connectDB();
registerSocketHandlers(io);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
