import UserModel from "../models/User.js";
import { AppError } from "../errors/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { TokenPayload } from "../types/TokenPayload.js";

class AuthService {
    async register(data: CreateUserDTO) {
        const { name, email, password } = data;

        if (!name || !email || !password) {
            throw new AppError("Campos obrigatórios não preenchidos", 400);
        }

        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            throw new AppError("E-mail já está em uso", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }

    async login(email: string, password: string) {
        if (!email.trim() || !password.trim()) {
            throw new AppError("E-mail e senha obrigatórios", 400);
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new AppError("Credenciais inválidas", 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Credenciais inválidas", 401);
        }

        const payload: TokenPayload = {
            id: user._id.toString(),
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return { user, token };
    }
}

export default new AuthService();