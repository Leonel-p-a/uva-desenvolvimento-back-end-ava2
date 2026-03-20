import { Request, Response } from "express";
import UserModel from "../models/User.js";
import { AppError } from "../errors/AppError.js";

class UserController {
    async me(req: Request, res: Response) {
        if (!req.user) {
            throw new AppError("Usuário não encontrado", 404)
        }
        const userId = req.user.id;

        const user = await UserModel.findById(userId).select("-password");

        return res.json(user);
    }
}

export default new UserController();