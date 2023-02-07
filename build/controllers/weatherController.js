"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
class WeatherController {
    constructor() { }
    getWeather(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = req.params.city;
            let options = { json: true };
            // const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ', CU&APPID=34b197ed03d2291a7604953e84cb67a5&lang=es&units=metric'
            request.get({
                url: 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba',
                options,
                headers: {
                    'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'
                },
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                    res.status(404).json({ text: 'Error al contactar con el servidor' });
                }
                ;
                if (!error && res.statusCode == 200) {
                    const cities = JSON.parse(body);
                    console.log(cities);
                    if (cities) {
                        const url2 = 'https://api.open-meteo.com/v1/forecast?latitude=' + cities[0].latitude + '&longitude=' + cities[0].longitude + '&current_weather=true&timezone=auto';
                        console.log(url2);
                        request(url2, options, (error, response2, body2) => {
                            if (error) {
                                console.log(error);
                                res.status(404).json({ text: 'Error al contactar con el servidor' });
                            }
                            ;
                            if (!error && res.statusCode == 200) {
                                res.json(body2);
                                console.log(body2);
                            }
                            ;
                        });
                    }
                }
                ;
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
        });
    }
}
const weatherController = new WeatherController();
exports.default = weatherController;
