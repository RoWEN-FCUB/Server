import { Router } from 'express';
import WeatherController from '../controllers/weatherController';

class WeatherRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/:city', WeatherController.getWeather);        
    }
}
const weatherRoutes = new WeatherRoutes();
export default weatherRoutes.router;