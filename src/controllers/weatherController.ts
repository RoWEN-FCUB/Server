import { Request, Response } from 'express';
//const request = require('request');
var fetch = require('node-fetch');

class WeatherController {
    constructor() {}

    public async getWeather (req: Request, res: Response): Promise<void>{
      const city = req.params.city;
      const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba';
      try {
        const response = await fetch(url, {
          method: 'get',
          headers:{'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'}
        });
        const cities = await response.json();
        console.log(cities);
        if (cities.length > 0) {
          const url2 = 'https://api.open-meteo.com/v1/forecast?latitude='+cities[0].latitude+'&longitude='+cities[0].longitude+'&current_weather=true&timezone=auto';
          const response2 = await fetch(url2, {method: 'get'});
          const weather = await response2.json();
          console.log(weather);
          res.json(weather);
        }
      } catch (error) {
        console.log(error);
        res.status(404).json({text: 'Error al contactar con el servidor api'});
      }
    }
}
const weatherController = new WeatherController();
export default weatherController;