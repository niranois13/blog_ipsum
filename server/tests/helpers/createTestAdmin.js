import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash("plain-password", 10);

export async function createTestAdmin(models) {
    const { User } = models;

    const admin = await User.create({
        id: uuid(),
        email: "admin@test.local",
        username: "admin",
        role: "ADMIN",
        password: hashedPassword,
    });

    return { admin };
}
