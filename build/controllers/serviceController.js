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
class ServiceController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield database_1.default.query("SELECT servicios.*, empresas.siglas AS nombre_emp FROM servicios LEFT JOIN empresas ON (empresas.id = servicios.id_emp);", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    userServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT servicios.* FROM servicios INNER JOIN usuario_servicio ON (servicios.id = usuario_servicio.id_servicio) WHERE usuario_servicio.id_usuario = ?;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM servicios WHERE id = ?;", [id], function (error, results, fields) {
                res.json(results[0]);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            console.log(req.body);
            yield database_1.default.query('INSERT INTO servicios SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Service saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(req.body);
            const result = database_1.default.query('UPDATE servicios set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Service updated" });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield database_1.default.query('DELETE FROM servicios WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Service deleted" });
            });
        });
    }
}
const serviceController = new ServiceController();
exports.default = serviceController;