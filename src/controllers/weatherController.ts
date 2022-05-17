import { Request, Response } from 'express';
var moment = require('moment');
var fetch = require('node-fetch');

class WeatherController {
    constructor() {}

    public async getWeather (req: Request, res: Response): Promise<void>{
        const city = req.params.city;
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ', CU&APPID=34b197ed03d2291a7604953e84cb67a5&lang=es&units=metric'
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'text/plain'
            }
        }).then((myJson: JSON) => {
            res.json(myJson);
        }).catch((err: any) => {
            console.log(err);
            res.status(404).json({text: 'Error al contactar con el servidor'});
        });
        // const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        // console.log(myJson);
        // res.json(myJson);
    }
}
const weatherController = new WeatherController();
export default weatherController;