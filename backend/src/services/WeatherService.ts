import { AppError } from "../errors/AppError.js";

class WeatherService {
    async getWeatherByCity(city: string) {
        if (!city) {
            throw new AppError("Cidade é obrigatória", 400);
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        if (!response.ok) {
            throw new AppError("Cidade não encontrada", 404);
        }

        const data = await response.json();

        return {
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
        };
    }

    async getWeatherByCoords(lat: number, lon: number) {
        if (!lat || !lon) {
            throw new AppError("Latitude e longitude obrigatórias", 400);
        }
    
        const apiKey = process.env.OPENWEATHER_API_KEY;
    
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        if (!response.ok) {
            throw new AppError("Erro ao buscar clima por coordenadas", 500);
        }
    
        const data = await response.json();
    
        return {
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
        };
    }
}

export default new WeatherService();