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
        this.router.get('/list/:year&:month&:id_serv', energyController_1.default.list);
        this.router.get('/allservices/:year&:month&:id_user', energyController_1.default.allservices);
        this.router.get('/months/:year&:id_serv', energyController_1.default.listMonths);
        this.router.get('/monthsallservices/:year&:id_user', energyController_1.default.listMonthsAllServices);
        this.router.get('/reading/:date&:id_serv', energyController_1.default.getReading);
        this.router.get('/readingbyservices/:id&:fecha', energyController_1.default.getReadingsByService);
        this.router.post('/create', energyController_1.default.create);
        this.router.put('/update/:id', energyController_1.default.update);
        this.router.put('/updateAll', energyController_1.default.updateAll);
        this.router.put('/updatePlans', energyController_1.default.updatePlans);
        this.router.delete('/:id', energyController_1.default.deleteERecord);
    }
}
const energyRoutes = new EnergyRoutes();
exports.default = energyRoutes.router;
