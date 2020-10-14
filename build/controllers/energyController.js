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
var moment = require('moment');
class EnergyController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { month } = req.params;
            const { year } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ?;", [year, month], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getReading(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.params;
            const tasks = yield database_1.default.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? ORDER BY lectura DESC LIMIT 1 ", [date], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            delete req.body.planacumulado;
            delete req.body.realacumulado;
            req.body.fecha = req.body.fecha.substr(0, req.body.fecha.indexOf('T'));
            req.body.plan = Number(req.body.plan);
            req.body.lectura = Number(req.body.lectura);
            const query = 'INSERT INTO energia (fecha, plan, consumo, lectura) VALUES(\'' + req.body.fecha + '\', ' + req.body.plan + ', ' + req.body.consumo + ', ' + req.body.lectura + ');';
            yield database_1.default.query(query, function (error, results, fields) {
                res.json({ message: 'Energy record saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let oldpass = '';
        });
    }
}
const energyController = new EnergyController();
exports.default = energyController;
