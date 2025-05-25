import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import connectDB from "./utils/mongoose";
import { checkENV } from "./utils/lib";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
checkENV();
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
