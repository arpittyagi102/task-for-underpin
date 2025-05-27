import { Router, Request, Response, RequestHandler } from "express";
import User, { IUser } from "../models/User";
import { createJWTToken } from "../utils/lib";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import { io } from "../index"

const router = Router();
router.post("/register", (async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, role, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        let user = await User.findOne({ email });
        if (user && user.blocked) {
            return res.status(403).json({ message: "User is blocked" });
        } else if (user) {
            return res.status(400).json({ message: "User already exists" });
        } 

        user = new User({ 
            firstName, 
            lastName, 
            role, 
            email, 
            password, 
            bananaCount: 0, 
            blocked: false,
            createdAt: new Date() 
        });
        await user.save();

        const token = createJWTToken(user._id);
        const userToReturn = { _id: user._id, firstName, role, lastName, email, bananaCount: user.bananaCount }
        // @ts-ignore
        sendNewUser(userToReturn);

        res.status(201).json({ user: userToReturn, token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

router.post("/login", (async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        if (user.blocked) {
            return res.status(403).json({ message: "User is blocked" });
        }

        const token = createJWTToken(user._id);
        const userToReturn = {
            _id : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            bananaCount: user.bananaCount || 0
        }

        res.json({ user: userToReturn, token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

router.post('/validate-token', authMiddleware, (async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ _id:userId });
    if (!user) {
        return res.status(400).json({ message: "User Not Found" });
    }

    if (user.blocked) {
        return res.status(403).json({ message: "User is blocked" });
    }

    const userToReturn = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bananaCount: user.bananaCount || 0
    }

    res.json({ user:userToReturn });
}) as RequestHandler);

export default router;

function sendNewUser(user: User) {
    io.emit("newUser", user);
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bananaCount: number;
}