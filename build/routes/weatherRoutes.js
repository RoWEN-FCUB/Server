"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherController_1 = __importDefault(require("../controllers/weatherController"));
class WeatherRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:city', weatherController_1.default.getWeather);
    }
}
const weatherRoutes = new WeatherRoutes();
exports.default = weatherRoutes.router;
