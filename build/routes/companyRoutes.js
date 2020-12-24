"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = __importDefault(require("../controllers/companyController"));
class CompanyRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', companyController_1.default.list);
    }
}
const companyRoutes = new CompanyRoutes();
exports.default = companyRoutes.router;
