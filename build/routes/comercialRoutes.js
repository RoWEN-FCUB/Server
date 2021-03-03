"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comercialController_1 = __importDefault(require("../controllers/comercialController"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public' });
class CompanyRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/listProviders/:id_empresa', comercialController_1.default.listProviders);
        this.router.get('/listProducts/:id_proveedor', comercialController_1.default.listProducts);
        this.router.get('/listReceipts/:id_proveedor&:concilied&:delivered', comercialController_1.default.listReceipts);
        this.router.post('/product', comercialController_1.default.createProduct);
        this.router.post('/upload', multipartMiddleware, comercialController_1.default.upload);
    }
}
const companyRoutes = new CompanyRoutes();
exports.default = companyRoutes.router;
