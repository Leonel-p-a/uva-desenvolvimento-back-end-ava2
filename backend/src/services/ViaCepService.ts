import { AppError } from "../errors/AppError.js";

class ViaCepService {
    async getAddressByCep(cep: string) {

        const cleanCep = cep.replace(/\D/g, "");

        if (cleanCep.length !== 8) {
            throw new AppError("CEP inválido", 400);
        }

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

        const data = await response.json();

        if (data.erro) {
            throw new AppError("CEP não encontrado", 404);
        }

        return {
            cep: data.cep,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
        };
    }
}

export default new ViaCepService();