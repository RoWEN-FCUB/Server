"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geeController_1 = __importDefault(require("../controllers/geeController"));
class GEERoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/list/', geeController_1.default.list);
        this.router.get('/fuelPrices/', geeController_1.default.getFuelPrices);
        this.router.get('/listGEEByUser/:id', geeController_1.default.listGEEByUser);
        this.router.get('/listGEERecords/:id', geeController_1.default.listRecords);
        this.router.get('/listCardsByGEE/:id_gee', geeController_1.default.listCardsbyGEE);
        this.router.get('/listTanksByGEE/:id_gee', geeController_1.default.listTanksbyGEE);
        this.router.get('/listCardsRecords/:id_card', geeController_1.default.listCardsRecords);
        this.router.post('/', geeController_1.default.create);
        this.router.post('/FCard', geeController_1.default.createFCard);
        this.router.post('/FCardRecord', geeController_1.default.createCardRecord);
        this.router.post('/changeFuelPrice', geeController_1.default.changeFuelPrice);
        this.router.put('/:id', geeController_1.default.update);
        this.router.delete('/:id', geeController_1.default.delete);
        this.router.delete('/deleteCardRecord/:id', geeController_1.default.deleteCardRecord);
        this.router.delete('/deleteFuelCard/:id', geeController_1.default.deleteFuelCard);
    }
}
const geeRoutes = new GEERoutes();
exports.default = geeRoutes.router;
