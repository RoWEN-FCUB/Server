"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geeController_1 = __importDefault(require("../controllers/geeController"));
class GEERoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list/', geeController_1.default.list);
        this.router.get('/listGEEByUser/:id', geeController_1.default.listGEEByUser);
        this.router.get('/listGEERecords/:id', geeController_1.default.listRecords);
        this.router.post('/', geeController_1.default.create);
        this.router.put('/:id', geeController_1.default.update);
        this.router.delete('/:id', geeController_1.default.delete);
    }
}
const geeRoutes = new GEERoutes();
exports.default = geeRoutes.router;
