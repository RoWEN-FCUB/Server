"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const avatarController_1 = __importDefault(require("../controllers/avatarController"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public' });
class AvatarRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/', multipartMiddleware, avatarController_1.default.create);
        //this.router.put('/:id', usersController.update);
        //this.router.delete('/:id', usersController.delete);
    }
}
const avatarRoutes = new AvatarRoutes();
exports.default = avatarRoutes.router;
