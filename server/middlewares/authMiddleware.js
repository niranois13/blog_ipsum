import { verifyToken } from "../utils/jwtHandler";

export function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        const payload = verifyToken(token);

        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export function requireAdmin(req, res, next) {
    if (!req.user) return res.status(500).json({ error: "Not authenticated" });

    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    next();
}

export function requireSelf(req, res, next) {
    if (!req.user) return res.status(500).json({ error: "Not authenticated" });

    const targetId = req.params.id;

    if (!req.user.id !== targetId) return res.status(403).json({ error: "Forbidden" });

    next();
}
