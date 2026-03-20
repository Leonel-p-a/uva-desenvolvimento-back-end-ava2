import { Request, Response } from "express";
import weatherService from "../services/WeatherService.js";
import { WeatherParams } from "../types/WeatherParams.js"

class WeatherController {
    async getWeather(req: Request<WeatherParams>, res: Response) {
        const { city } = req.params;

        const weather = await weatherService.getWeatherByCity(city);

        return res.json(weather);
    }

    async getWeatherByCoords(req: Request, res: Response) {
        const { lat, lon } = req.query;
    
        const weather = await weatherService.getWeatherByCoords(
            Number(lat),
            Number(lon)
        );
    
        return res.json(weather);
    }
}

export default new WeatherController();