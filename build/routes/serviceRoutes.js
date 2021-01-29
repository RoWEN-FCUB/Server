"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
class ServiceRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', serviceController_1.default.list);
        this.router.get('/get/:id', serviceController_1.default.getOne);
        this.router.get('/user_services/:id', serviceController_1.default.userServices);
        this.router.post('/', serviceController_1.default.create);
        this.router.put('/:id', serviceController_1.default.update);
        this.router.delete('/:id', serviceController_1.default.delete);
    }
}
const serviceRoutes = new ServiceRoutes();
exports.default = serviceRoutes.router;