import { myError } from "../../utils/errors.js";
import { loginUserService } from "../../services/authService.js";
import { generateCookie } from "../../utils/jwtHandler.js";

export async function loginUser(req, res) {
    const models = req.app.locals.models;
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            error: "No credentials found.",
        });

    try {
        const { user, token } = await loginUserService(email, password, models);
        if (!user || !token) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        generateCookie(res, token);

        return res.status(200).json({ user });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export function logOut(req, res) {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Token successfully cleared" });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
