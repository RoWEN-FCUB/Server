"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
class NotificationsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id', notificationController_1.default.getAllNotifications);
        this.router.delete('/:id', notificationController_1.default.deleteNotification);
        this.router.delete('/all/:id', notificationController_1.default.deleteAllNotifications);
        this.router.get('/news/:id', notificationController_1.default.getNewNotifications);
        this.router.put('/readed/:id', notificationController_1.default.notificationReaded);
        this.router.put('/allreaded/:id&:notifid', notificationController_1.default.notificationsReaded);
    }
}
const notificationsRoutes = new NotificationsRoutes();
exports.default = notificationsRoutes.router;
