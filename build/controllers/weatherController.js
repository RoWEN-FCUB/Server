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
//const request = require('request');
var fetch = require('node-fetch');
class WeatherController {
    constructor() { }
    getWeather(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = req.params.city;
            const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba';
            try {
                const response = yield fetch(url, {
                    method: 'get',
                    headers: { 'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq' }
                });
                const cities = yield response.json();
                console.log(cities);
                if (cities.length > 0) {
                    const url2 = 'https://api.open-meteo.com/v1/forecast?latitude=' + cities[0].latitude + '&longitude=' + cities[0].longitude + '&current_weather=true&timezone=auto';
                    const response2 = yield fetch(url2, { method: 'get' });
                    const weather = yield response2.json();
                    console.log(weather);
                    res.json(weather);
                }
            }
            catch (error) {
                console.log(error);
                res.status(404).json({ text: 'Error al contactar con el servidor api' });
            }
        });
    }
}
const weatherController = new WeatherController();
exports.default = weatherController;
