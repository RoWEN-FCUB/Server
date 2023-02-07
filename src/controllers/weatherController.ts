import { Request, Response } from 'express';
const request = require('request');

class WeatherController {
    constructor() {}

    public async getWeather (req: Request, res: Response): Promise<void>{
        const city = req.params.city;
        
        let options = {json: true};
        // const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ', CU&APPID=34b197ed03d2291a7604953e84cb67a5&lang=es&units=metric'
        request.get({
            url: 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba',
            options,
            headers: {
              'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'
            },
          },function(error: any, response: any, body: any) {
            if (error) {
                console.log(error);
                res.status(404).json({text: 'Error al contactar con el servidor'});
            };
        
            if (!error && res.statusCode == 200) {
                const cities:Array<{ name: string; latitude: number, longitude: number, country: string, state: string}> = JSON.parse(body);
                console.log(cities);
                if (cities) {
                    const url2 = 'https://api.open-meteo.com/v1/forecast?latitude='+cities[0].latitude+'&longitude='+cities[0].longitude+'&current_weather=true&timezone=auto';
                    console.log(url2);
                    request(url2, options, (error: any, response2: any, body2: any) => {
                        if (error) {
                            console.log(error);
                            res.status(404).json({text: 'Error al contactar con el servidor'});
                        };
                    
                        if (!error && res.statusCode == 200) {
                            res.json(body2);
                            console.log(body2);
                        };
                    });
                }
            };
          });
        

        /* request.get({
            url: 'https://api.api-ninjas.com/v1/weather?city=' + city,
            headers: {
              'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'
            },
          }, function(error: any, response: any, body: any) {
            if (error) {
                console.log(error);
                res.status(404).json({text: 'Error al contactar con el servidor'});
            };
        
            if (!error && res.statusCode == 200) {
                res.json(body);
                console.log(body);
            };
          }); */

    }
}
const weatherController = new WeatherController();
export default weatherController;