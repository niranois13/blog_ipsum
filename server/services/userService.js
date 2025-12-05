import { myError } from "../utils/errors.js";
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import { generateRandomUsername } from "../utils/visitorHandler.js";
import { createRegisteredUser } from "../controllers/userPublicController.js";

export async function createUserService(data, models) {
    const { User } = models;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
        username: data.username,
    });

    return user;
}

export async function updateUserService(data, userId, models) {
    const { User } = models;

    const user = await User.findByPk(userId);
    if (!user) throw new myError("Unable to retrieve specified User", 404);

    if (!data.password) throw new myError("A password is needed to update this user", 400);

    data.password = await bcrypt.hash(data.password, 10);

    await user.update(data);

    return user;
}

export async function deleteUserService(userId, models) {
    const { User } = models;

    const user = await User.findByPk(userId);
    if (!user) throw new myError("Unable to retrieve specified User", 404);

    await user.destroy();

    return user;
}

export async function getAllUsersService(models) {
    const { User } = models;

    const users = await User.findAll();

    return users;
}

export async function getUserByIdService(userId, models) {
    const { User } = models;

    const user = await User.findOne({
        where: { id: userId },
    });
    if (!user) throw new myError("Unable to retrieve specified User", 404);

    return user;
}

export async function handleVisitorEntry(data, models) {
    const { User } = models;

    const ipHash = crypto.createHash("sha256").update(data.ip + process.env.IP_SALT).digest("hex");

    let user = await User.findOne({
        where: { ipHash: ipHash }
    });
    if (user)
        return user;

    let randomUsername = null;

    for (let i = 0; i < 10; i++) {
        const candidate = generateRandomUsername();

        const exists = await User.findOne({
            where: { username: candidate }
        })

        if (!exists) {
            randomUsername = candidate;
            break;
        }
    }

    if (!randomUsername)
        throw new myError("Unable to generate unique username", 500);

    user = await User.create({
        email: null,
        password: null,
        role: "VISITOR",
        username: randomUsername,
        ipHash: ipHash
    });

    return user;
}

export async function promoteVisitorToRegistered(data, userId, models) {
    const { User } = models;

    const user = await User.findByPk(userId);
    if (!user) throw new myError("User not found", 404);
    if (user.role !== "VISITOR") throw new myError("User is not a visitor", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await user.update({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: "REGISTERED",
        ipHash: null
    });

    return user;
}
