import {
    myError
} from "../utils/errors.js"

import bcrypt from "bcryptjs";

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
    if (!user)
        throw new myError("Unable to retrieve specified User", 404);

    if (!data.password)
        throw new myError("A password is needed to update this user", 400);

    data.password = await bcrypt.hash(data.password, 10);

    await user.update(data);

    return user;
}

export async function deleteUserService(userId, models) {
    const { User } = models;

    const user = await User.findByPk(userId);
    if (!user)
        throw new myError("Unable to retrieve specified User", 404);

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
    if (!user)
        throw new myError("Unable to retrieve specified User", 404);

    return user;
}
