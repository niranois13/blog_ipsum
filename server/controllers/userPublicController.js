import {
    createUserService,
    updateUserService,
    deleteUserService,
} from "../services/userService.js";
import { myError } from "../utils/errors.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,}$/;
const usernameRegex = /^[\p{L}\p{N}@._~:\-’]+$/u;

export async function createRegisteredUser(req, res) {
    const models = req.app.locals.models;
    if (!models) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    const role = "REGISTERED";

    const { email, password, username } = req.body;

    if (!email || !emailRegex.test(email))
        return res.status(400).json({
            error: "A properly formatted email must be provided for account creation.",
        });
    if (!password || !passwordRegex.test(password))
        return res.status(400).json({
            error: "A properly formatted password must be provided for account creation.",
        });
    if (!username || !usernameRegex.test(username))
        return res.status(400).json({
            error: "A properly formatted username must be provided for account creation.",
        });

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

export async function updateRegisteredUser(req, res) {
    const models = req.app.locals.models;
    if (!models) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    const id = req.params.id;
    if (!id || !models) return res.status(404).json({ error: "Not found" });

    const { email, password, username } = req.body;

    const update = {};

    if (email != undefined) {
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Properly formatted email address is needed for profile update",
            });
        }
        update.email = email;
    }

    if (username != undefined) {
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                error: "Properly formatted username is needed for profile update",
            });
        }
        update.username = username;
    }

    if (password != undefined) {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Properly formatted password is needed for profile update",
            });
        }
        update.password = password;
    }

    update.role = "REGISTERED";

    try {
        const user = await updateUserService(update, id, models);

        return res.status(200).json({ user });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function deleteRegisteredUser(req, res) {
    const models = req.app.locals.models;
    if (!models) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    const id = req.params.id;
    if (!id || !models) return res.status(400).json({ error: "Not found" });

    try {
        const user = await deleteUserService(id, models);

        return res.status(201).json({ user });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
