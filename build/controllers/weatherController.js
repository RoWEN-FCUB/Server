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
var moment = require('moment');
var fetch = require('node-fetch');
class WeatherController {
    constructor() { }
    getWeather(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = req.params.city;
            const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ', CU&APPID=34b197ed03d2291a7604953e84cb67a5&lang=es&units=metric';
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            const myJson = yield response.json(); //extract JSON from the http response
            // do something with myJson
            // console.log(myJson);
            res.json(myJson);
        });
    }
}
const weatherController = new WeatherController();
exports.default = weatherController;
