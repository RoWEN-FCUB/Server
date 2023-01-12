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
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/listProviders/:id_empresa', comercialController_1.default.listProviders);
        this.router.get('/listProducts/:id_proveedor', comercialController_1.default.listProducts);
        this.router.get('/listReceipts/:id_proveedor&:concilied&:delivered', comercialController_1.default.listReceipts);
        this.router.get('/listMarkedReceipts/:id_proveedor', comercialController_1.default.listMarkedReceipts);
        this.router.get('/listReceiptProducts/:id_receipt', comercialController_1.default.listReceiptProducts);
        this.router.get('/searchreceipts/:str&:page&:id_provider&:concilied&:delivered', comercialController_1.default.searchReceipts);
        this.router.post('/product', comercialController_1.default.createProduct);
        this.router.post('/provider', comercialController_1.default.createProvider);
        this.router.post('/receipt', comercialController_1.default.createReceipt);
        this.router.post('/concic', comercialController_1.default.createConciliation);
        this.router.put('/product/:id', comercialController_1.default.updateProduct);
        this.router.put('/provider/:id', comercialController_1.default.updateProvider);
        this.router.put('/receipt/:id', comercialController_1.default.updateReceipt);
        this.router.delete('/product/:id', comercialController_1.default.deleteProduct);
        this.router.delete('/provider/:id', comercialController_1.default.deleteProvider);
        this.router.delete('/receipt/:id', comercialController_1.default.deleteReceipt);
        this.router.post('/upload', multipartMiddleware, comercialController_1.default.upload);
    }
}
const companyRoutes = new CompanyRoutes();
exports.default = companyRoutes.router;
