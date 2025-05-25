import jwt from "jsonwebtoken";
import { JWT_EXPIRATION } from "../utils/constants";

function checkENV() {
    const MONGO_URI = process.env.MONGO_URI;
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!MONGO_URI || !JWT_SECRET) {
        throw new Error("Missing required environment variables: MONGO_URI and JWT_SECRET must be set.");
    }
}

function createJWTToken(userId: string|unknown) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
}

export { checkENV, createJWTToken };