"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliverController_1 = __importDefault(require("../controllers/deliverController"));
class DeliverRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:code', deliverController_1.default.getRemoteDeliver);
        this.router.post('/', deliverController_1.default.saveDeliver);
    }
}
const deliverRoutes = new DeliverRoutes();
exports.default = deliverRoutes.router;
