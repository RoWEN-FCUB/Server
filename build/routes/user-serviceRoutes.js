"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_serviceController_1 = __importDefault(require("../controllers/user-serviceController"));
class UserServiceRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/get/:id', user_serviceController_1.default.getServices);
        this.router.delete('/:id', user_serviceController_1.default.delete);
    }
}
const userserviceRoutes = new UserServiceRoutes();
exports.default = userserviceRoutes.router;
