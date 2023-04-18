import { Request, Response } from 'express';
//const request = require('request');
var fetch = require('node-fetch');
var moment = require('moment');
import pool from '../database';

class WeatherController {
    constructor() {}

    public async getWeather (req: Request, res: Response): Promise<void>{
      const city = req.params.city;
      await pool.query('SELECT * FROM cities_weather WHERE name = ?', [city], async function(error: any, results: any, fields: any){
        if(results.length > 0) {
          //console.log(moment.utc(results[0].time));
          const h1 = moment.utc(results[0].time).hour();
          const h2 = new Date().getHours();
          console.log(h1 + ' ' + h2);
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
          } else {
            const url2 = 'https://api.open-meteo.com/v1/forecast?latitude='+results[0].latitude+'&longitude='+ results[0].longitude+'&current_weather=true&timezone=auto';
              try {
                const response2 = await fetch(url2, {method: 'get'});
                const weather = await response2.json();
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
                await pool.query('UPDATE cities_weather SET ? WHERE name = ?', [new_weather, city], function(error: any, results: any, fields: any){
                  res.json(weather);
                });
              } catch (error) {
                console.log(error);
                res.status(404).json({text: 'Error al contactar con el servidor api'});
              }
          }
          
        } else {
          const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + encodeURIComponent((city.normalize("NFD").replace(/[\u0300-\u036f]/g, "")).trim()) + '&country=Cuba';          
          console.log(url);
        try {
          const response = await fetch(url, {
            method: 'get',
            headers:{'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'}
          });
          const cities = await response.json();
          console.log(cities);
          if (cities.length > 0) {
            await pool.query('INSERT INTO cities_weather SET ?', cities[0], async function(error: any, results: any, fields: any){
              console.log('Saved new city');
              const url2 = 'https://api.open-meteo.com/v1/forecast?latitude='+cities[0].latitude+'&longitude='+cities[0].longitude+'&current_weather=true&timezone=auto';
              const response2 = await fetch(url2, {method: 'get'});
              const weather = await response2.json();
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
              await pool.query('UPDATE cities_weather SET ? WHERE name = ?', [new_weather, city], function(error: any, results: any, fields: any){
                res.json(weather);
              });
            });
          } else {
            console.log('Ciudad no encontrada');
            res.status(404).json({text: 'Error al contactar con el servidor api'});
          }
        } catch (error) {
          console.log(error);
          res.status(404).json({text: 'Error al contactar con el servidor api'});
        }
        }
    });
    }
}
const weatherController = new WeatherController();
export default weatherController;