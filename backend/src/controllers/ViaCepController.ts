import { Request, Response } from "express";
import viaCepService from "../services/ViaCepService.js";
import { CepParams } from "../types/CepParams.js";

class ViaCepController {
    async getAddress(req: Request<CepParams>, res: Response) {
        const { cep } = req.params;

        const address = await viaCepService.getAddressByCep(cep);

        return res.json(address);
    }
}

export default new ViaCepController();