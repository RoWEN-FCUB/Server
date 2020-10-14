"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const energyController_1 = __importDefault(require("../controllers/energyController"));
class EnergyRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:year&:month', energyController_1.default.list);
        this.router.get('/reading/:date', energyController_1.default.getReading);
        this.router.post('/', energyController_1.default.create);
    }
}
const energyRoutes = new EnergyRoutes();
exports.default = energyRoutes.router;
