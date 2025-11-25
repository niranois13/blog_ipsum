import bcrypt from 'bcryptjs';

export async function createUserService(data, models) {
    try {
        const { User } = models;
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await User.create({
            email: data.email,
            password: hashedPassword,
            role: data.role,
            username: data.username
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            throw new Error("Duplicate entry in createUser");

        throw error;
    }
}

export async function updateUserService(data, userId, models) {
    try {
        const { User } = models;

        const user = await User.findByPk(userId);
        if (!user)
            throw new Error("User not found");

        if (data.password)
            data.password = await bcrypt.hash(data.password, 10);

        await user.update(data);

        return user;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            throw new Error("Duplicate entry in updateUser")

        throw error;
    }
}

export async function deleteUserService(userId, models) {
    try {
        const { User } = models;

        const user = await User.findByPk(userId);
        if (!user)
            throw new Error("User not found");

        await user.destroy()

        return user;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsersService(models) {
    try {
        const { User } = models;

        const users = await User.findAll()
        if (!users)
            throw new Error("No user found");

        return users;
    } catch (error) {
        throw error;
    }
}

export async function getUserByIdService(userId, models) {
    try {
        const { User } = models;

        const user = await User.findOne({
            where: { id: userId }
        });
        if (!user)
            throw new Error("User not found");

        return user;
    } catch (error) {
        throw error;
    }
}
