import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtHandler.js";
import { myError } from "../utils/errors.js";

export async function loginUserService(email, password, models) {
    const { User } = models;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new myError("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new myError("Invalid credentials", 401);

    const token = generateToken({ id: user.id, role: user.role, email });

    return { user, token };
}
