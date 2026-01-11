import jwt from "jsonwebtoken";
import { myError } from "./errors.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXP;

export function generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: parseInt(JWT_EXP) });
    return token;
}

export function verifyToken(token) {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload.id || !payload.email) {
        throw new myError("Malformed token payload", 500);
    }

    return payload;
}

export function generateCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "strict",
        maxAge: parseInt(JWT_EXP) * 1000,
        path: "/",
    });
}
