import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
} from "../../services/userService.js";
import { myError } from "../../utils/errors.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[\p{L}\p{N}@._~:\-’]+$/u;
const adminKeyCheck = process.env.ADMIN_KEY_CHECK;

export async function createAdmin(req, res) {
    const models = req.app.locals.models;

    const { email, password, username, role, adminKey } = req.body;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            error: "A properly formatted email must be provided for account creation.",
        });
    }

    if (!password) {
        return res.status(400).json({
            error: "A password must be provided for account creation.",
        });
    }

    if (!username || !usernameRegex.test(username)) {
        return res.status(400).json({
            error: "A properly formatted username must be provided for account creation.",
        });
    }

    if (adminKey != adminKeyCheck) {
        return res.status(404).json({
            error: "Not found",
        });
    }

    if (role != "ADMIN") {
        return res.status(404).json({
            error: "Not found",
        });
    }

    try {
        const user = await createUserService(
            {
                email,
                password,
                username,
                role,
            },
            models
        );

        return res.status(201).json({ user });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getAllUsers(req, res) {
    const models = req.app.locals.models;

    try {
        const users = await getAllUsersService(models);

        return res.status(201).json(users);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getUserById(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;

    try {
        const user = await getUserByIdService(id, models);

        return res.status(201).json({ user });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
