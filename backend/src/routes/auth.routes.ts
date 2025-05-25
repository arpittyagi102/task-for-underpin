import { Router, Request, Response, RequestHandler } from "express";
import User from "../models/User";
import { createJWTToken } from "../utils/lib";

const router = Router();
router.post("/register", (async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

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
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ firstName, lastName, email, password });
    await user.save();

    const token = createJWTToken(user._id);
    const userToReturn = {firstName, lastName, email}

    res.status(201).json({ user:userToReturn, token });
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

    const token = createJWTToken(user._id);
    const userToReturn = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }

    res.json({ user: userToReturn, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

export default router;
