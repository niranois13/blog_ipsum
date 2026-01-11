import { verifyToken } from "../utils/jwtHandler.js";
import { generateRandomUsername } from "../utils/visitorHandler.js";

export async function resolveUser(req, res, next) {
    const { User } = req.app.locals.models;

    if (req.cookies?.token) {
        try {
            const payload = verifyToken(req.cookies.token);
            const user = await User.findByPk(payload.id);
            if (user) {
                req.user = user;
                return next();
            }
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    let visitorId = req.cookies?.visitor_id;

    if (!visitorId) {
        const username = generateRandomUsername();

        const visitor = await User.create({
            username,
            role: "VISITOR",
        });

        res.cookie("visitor_id", visitor.id, {
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });

        req.user = visitor;
        return next();
    }

    const visitor = await User.findByPk(visitorId);
    if (!visitor) {
        res.clearCookie("visitor_id");
        return resolveUser(req, res, next);
    }

    req.user = visitor;
    next();
}
