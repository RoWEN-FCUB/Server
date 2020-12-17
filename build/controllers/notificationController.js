"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class NotificationController {
    getAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // id del usuario
            const notif = yield database_1.default.query('SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY id DESC', [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getNewNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // id del usuario        
            const notif = yield database_1.default.query('SELECT * FROM notificaciones WHERE id_usuario = ? AND leida = false ORDER BY id DESC', [id], function (error, results, fields) {
                // console.log(results);
                res.json(results);
            });
        });
    }
    notificationReaded(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //console.log(id);
            const notif = yield database_1.default.query('UPDATE notificaciones SET leida = true WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Notification readed" });
            });
        });
    }
    notificationsReaded(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { notifid } = req.params;
            const notif = yield database_1.default.query('UPDATE notificaciones SET leida = true WHERE id_usuario = ? AND id <= ?', [id, notifid], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ text: "Notification readed" });
            });
        });
    }
    deleteNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM notificaciones WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Notification deleted" });
            });
        });
    }
    deleteAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM notificaciones WHERE id_usuario = ?', [id], function (error, results, fields) {
                res.json({ text: "Notifications deleted" });
            });
        });
    }
}
const notificationController = new NotificationController();
exports.default = notificationController;
