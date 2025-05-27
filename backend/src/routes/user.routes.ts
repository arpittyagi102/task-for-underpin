import { Router, Request, Response, RequestHandler } from "express";
import User from "../models/User";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:userId", authMiddleware, (async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId }, { password: 0 });
    if (user?.blocked) {
      return res.status(403).json({ message: "User is blocked" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

// Get all users
router.get("/", authMiddleware, (async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

router.delete("/:userId", authMiddleware, (async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;

    // Prevent deleting yourself
    if (userId === req.userId) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

// Block/Unblock user
router.patch("/:userId/block", authMiddleware, (async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { blocked } = req.body;

    // Prevent blocking yourself
    if (userId === req.userId) {
      return res.status(400).json({ message: "Cannot block your own account" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { blocked: blocked } },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

// Update user details
router.patch("/:userId", authMiddleware, (async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password, role } = req.body;

    // Prevent updating yourself
    if (userId === req.userId) {
      return res
        .status(400)
        .json({ message: "Cannot update your own account" });
    }

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      updateData.email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      updateData.password = password;
    }
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}) as RequestHandler);

export default router;
