import { Router, Request, Response, RequestHandler } from "express";
import User from "../models/User";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();

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

// Delete user
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

export default router;
