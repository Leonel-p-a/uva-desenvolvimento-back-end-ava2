import { Request, Response } from "express";
import authService from "../services/AuthService.js";

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Preencher campos obigatórios' });
            }

            const user = await authService.register(req.body);
            const { password: _, ...userWithoutPassword } = user.toObject();
        
            return res.status(201).json(userWithoutPassword);
        } catch (error: any) {
            return res.status(error.status || 500).json({ message: error.message });
        }

    }

    async login(req: Request, res: Response) {
        try{
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Preencher campos obrigatórios' });
            }
        
            const { user, token } = await authService.login(email, password);
            const { password: _, ...userWithoutPassword } = user.toObject();
        
            return res.status(200).json({
                user: userWithoutPassword,
                token
            });
        } catch (error: any) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default new AuthController();