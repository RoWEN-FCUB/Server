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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const request = require('request');
var fetch = require('node-fetch');
var moment = require('moment');
const database_1 = __importDefault(require("../database"));
class WeatherController {
    constructor() { }
    getWeather(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = req.params.city;
            yield database_1.default.query('SELECT * FROM cities_weather WHERE name = ?', [city], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (results.length > 0) {
                        //console.log(moment.utc(results[0].time));
                        const h1 = moment.utc(results[0].time).hour();
                        const h2 = new Date().getHours();
                        //console.log(h1 + ' ' + h2);
                        if (moment(results[0].time).isSame(new Date(), 'day') && h1 === h2) {
                            const weather = {
                                latitude: results[0].latitude,
                                longitude: results[0].longitude,
                                current_weather: {
                                    weathercode: results[0].weathercode,
                                    temperature: results[0].temperature,
                                    windspeed: results[0].windspeed,
                                    winddirection: results[0].winddirection,
                                }
                            };
                            res.json(weather);
                        }
                        else {
                            const url2 = 'https://api.open-meteo.com/v1/forecast?latitude=' + results[0].latitude + '&longitude=' + results[0].longitude + '&current_weather=true&timezone=auto';
                            const response2 = yield fetch(url2, { method: 'get' });
                            const weather = yield response2.json();
                            const new_weather = {
                                generationtime_ms: weather.generationtime_ms,
                                utc_offset_seconds: weather.utc_offset_seconds,
                                timezone: weather.timezone,
                                timezone_abbreviation: weather.timezone_abbreviation,
                                elevation: weather.elevation,
                                temperature: weather.current_weather.temperature,
                                windspeed: weather.current_weather.windspeed,
                                winddirection: weather.current_weather.winddirection,
                                weathercode: weather.current_weather.weathercode,
                                time: weather.current_weather.time,
                            };
                            console.log(new_weather);
                            yield database_1.default.query('UPDATE cities_weather SET ? WHERE name = ?', [new_weather, city], function (error, results, fields) {
                                res.json(weather);
                            });
                        }
                    }
                    else {
                        const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + encodeURIComponent((city.normalize("NFD").replace(/[\u0300-\u036f]/g, "")).trim()) + '&country=Cuba';
                        console.log(url);
                        try {
                            const response = yield fetch(url, {
                                method: 'get',
                                headers: { 'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq' }
                            });
                            const cities = yield response.json();
                            console.log(cities);
                            if (cities.length > 0) {
                                yield database_1.default.query('INSERT INTO cities_weather SET ?', cities[0], function (error, results, fields) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        console.log('Saved new city');
                                        const url2 = 'https://api.open-meteo.com/v1/forecast?latitude=' + cities[0].latitude + '&longitude=' + cities[0].longitude + '&current_weather=true&timezone=auto';
                                        const response2 = yield fetch(url2, { method: 'get' });
                                        const weather = yield response2.json();
                                        const new_weather = {
                                            generationtime_ms: weather.generationtime_ms,
                                            utc_offset_seconds: weather.utc_offset_seconds,
                                            timezone: weather.timezone,
                                            timezone_abbreviation: weather.timezone_abbreviation,
                                            elevation: weather.elevation,
                                            temperature: weather.current_weather.temperature,
                                            windspeed: weather.current_weather.windspeed,
                                            winddirection: weather.current_weather.winddirection,
                                            weathercode: weather.current_weather.weathercode,
                                            time: weather.current_weather.time,
                                        };
                                        console.log(new_weather);
                                        yield database_1.default.query('UPDATE cities_weather SET ? WHERE name = ?', [new_weather, city], function (error, results, fields) {
                                            res.json(weather);
                                        });
                                    });
                                });
                            }
                            else {
                                console.log('Ciudad no encontrada');
                                res.status(404).json({ text: 'Error al contactar con el servidor api' });
                            }
                        }
                        catch (error) {
                            console.log(error);
                            res.status(404).json({ text: 'Error al contactar con el servidor api' });
                        }
                    }
                });
            });
        });
    }
}
const weatherController = new WeatherController();
exports.default = weatherController;
