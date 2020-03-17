"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workshopController_1 = __importDefault(require("../controllers/workshopController"));
class WorkshopRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', workshopController_1.default.listAll);
        this.router.get('/clients', workshopController_1.default.listClients);
        this.router.get('/devices', workshopController_1.default.listDevices);
    }
}
const workshopRoutes = new WorkshopRoutes();
exports.default = workshopRoutes.router;
