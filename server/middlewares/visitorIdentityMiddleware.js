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
    let visitor = null;

    if (visitorId) {
        visitor = await User.findByPk(visitorId);
    }

    if (visitorId && !visitor) {
        res.clearCookie("visitor_id");
        visitorId = null;
    }

    if (!visitorId) {
        const username = generateRandomUsername();

        visitor = await User.create({
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

    req.user = visitor;
    next();
}
