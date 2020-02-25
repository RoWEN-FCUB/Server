"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = __importDefault(require("../controllers/usersController"));
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', usersController_1.default.list);
        this.router.get('/:id', usersController_1.default.getOne);
        this.router.get('/sub/:id', usersController_1.default.getSubordinados);
        this.router.get('/sup/:id', usersController_1.default.getSuperior);
        this.router.post('/', usersController_1.default.create);
        this.router.put('/:id', usersController_1.default.update);
        this.router.delete('/:id', usersController_1.default.delete);
        this.router.post('/login', usersController_1.default.validate);
        this.router.post('/valid', usersController_1.default.user_valid);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
