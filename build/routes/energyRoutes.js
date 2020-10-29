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
        this.router.get('/list/:year&:month', energyController_1.default.list);
        this.router.get('/months/:year', energyController_1.default.listMonths);
        this.router.get('/reading/:date', energyController_1.default.getReading);
        this.router.post('/create', energyController_1.default.create);
        this.router.put('/update/:id', energyController_1.default.update);
        this.router.put('/updateAll', energyController_1.default.updateAll);
        this.router.put('/updatePlans', energyController_1.default.updatePlans);
        this.router.delete('/:id', energyController_1.default.deleteERecord);
    }
}
const energyRoutes = new EnergyRoutes();
exports.default = energyRoutes.router;