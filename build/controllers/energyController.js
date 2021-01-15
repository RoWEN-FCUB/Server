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
            const { id_emp } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND id_emp = ?;", [year, month, id_emp], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listMonths(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.params;
            const { id_emp } = req.params;
            const tasks = yield database_1.default.query("SELECT MONTH(fecha) as Mes, sum(plan) as Plan, sum(consumo) as Consumo FROM energia WHERE YEAR(fecha) = ? AND id_emp = ? GROUP BY MONTH(fecha) ORDER BY mes;", [year, id_emp], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getReading(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.params;
            const { id_emp } = req.params;
            const tasks = yield database_1.default.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? AND id_emp = ? ORDER BY lectura DESC LIMIT 1 ", [date, id_emp], function (error, results, fields) {
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
            req.body.id_emp = Number(req.body.id_emp);
            const query = 'INSERT INTO energia (fecha, plan, consumo, lectura, id_emp) VALUES(\'' + req.body.fecha + '\', ' + req.body.plan + ', ' + req.body.consumo + ', ' + req.body.lectura + ', ' + req.body.id_emp + ');';
            yield database_1.default.query(query, function (error, results, fields) {
                res.json({ message: 'Energy record saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.planacumulado;
            delete req.body.realacumulado;
            // req.body.fecha = req.body.fecha.substr(0,req.body.fecha.indexOf('T'));
            req.body.plan = Number(req.body.plan);
            req.body.lectura = Number(req.body.lectura);
            req.body.id_emp = Number(req.body.id_emp);
            const query = 'UPDATE energia SET plan = ' + req.body.plan + ', consumo = ' + req.body.consumo + ', lectura = ' + req.body.lectura + ', plan_hpic = ' + req.body.plan_hpic + ', real_hpic = ' + req.body.real_hpic + ', id_emp = ' + req.body.id_emp + ' WHERE id = ' + id + ';';
            // console.log(query);
            yield database_1.default.query(query, function (error, results, fields) {
                res.json({ message: 'Energy record updated' });
            });
        });
    }
    updateAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let updates = [];
            for (let i = 0; i < req.body.length; i++) {
                delete req.body[i].fecha;
                delete req.body[i].realacumulado;
                delete req.body[i].planacumulado;
                updates.push(Object.values(req.body[i]));
            }
            // console.log(updates);
            // const query = 'UPDATE energia SET fecha = \''+req.body.fecha+'\',plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
            yield database_1.default.query('INSERT INTO energia (id, plan, consumo, lectura, plan_hpic, real_hpic, id_emp) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan),consumo=VALUES(consumo),lectura=VALUES(lectura),plan_hpic=VALUES(plan_hpic),real_hpic=VALUES(real_hpic);', [updates], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Energy record updated' });
            });
            res.json({ message: 'Energy record updated' });
        });
    }
    updatePlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body);
            let inicio = req.body.start.substr(0, req.body.start.indexOf('T'));
            const fin = req.body.end.substr(0, req.body.end.indexOf('T'));
            const plan = req.body.plan;
            const plan_pico = req.body.plan_pico;
            const id_emp = req.body.id_emp;
            let erecords = [];
            while (moment(inicio).isSameOrBefore(fin, 'day')) {
                erecords.push([inicio, Number(plan), Number(plan_pico), Number(id_emp)]);
                inicio = moment(inicio).add(1, 'days').format('YYYY-MM-DD');
            }
            //console.log(erecords);
            yield database_1.default.query('INSERT INTO energia (fecha, plan, plan_hpic, id_emp) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan), plan_hpic=VALUES(plan_hpic);', [erecords], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Energy record updated' });
            });
            res.json({ message: 'Energy record updated' });
        });
    }
    deleteERecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE energia SET consumo = null, lectura = null, real_hpic = null WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Energy record deleted" });
            });
        });
    }
}
const energyController = new EnergyController();
exports.default = energyController;
