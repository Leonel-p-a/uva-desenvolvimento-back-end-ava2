import { Request, Response } from "express";
import authService from "../services/AuthService.js";

class AuthController {
    async register(req: Request, res: Response) {
        const user = await authService.register(req.body);
    
        const { password, ...userWithoutPassword } = user.toObject();
    
        return res.status(201).json(userWithoutPassword);
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
    
        const { user, token } = await authService.login(email, password);
    
        const { password: _, ...userWithoutPassword } = user.toObject();
    
        return res.json({
            user: userWithoutPassword,
            token
        });
    }
}

export default new AuthController();