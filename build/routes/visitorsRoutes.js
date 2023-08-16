"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitorsController_1 = __importDefault(require("../controllers/visitorsController"));
class VisitorsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/records/:page&:id_serv', visitorsController_1.default.listAll);
        this.router.post('/filter/:page&:id_serv', visitorsController_1.default.filterVisitors);
        this.router.get('/one/:ci', visitorsController_1.default.listOne);
        this.router.get('/names/:id_serv', visitorsController_1.default.listNames);
        this.router.post('/', visitorsController_1.default.create);
        this.router.put('/:id', visitorsController_1.default.update);
        this.router.delete('/:id', visitorsController_1.default.delete);
    }
}
const visitorsRoutes = new VisitorsRoutes();
exports.default = visitorsRoutes.router;
