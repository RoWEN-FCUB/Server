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
            const { id_serv } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND id_serv = ?;", [year, month, id_serv], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listMonths(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.params;
            const { id_serv } = req.params;
            const tasks = yield database_1.default.query("SELECT MONTH(fecha) as Mes, sum(plan) as Plan, sum(consumo) as Consumo FROM energia WHERE YEAR(fecha) = ? AND id_serv = ? GROUP BY MONTH(fecha) ORDER BY mes;", [year, id_serv], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getReading(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.params;
            const { id_serv } = req.params;
            const tasks = yield database_1.default.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? AND id_serv = ? ORDER BY lectura DESC LIMIT 1 ", [date, id_serv], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getReadingsByService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fecha } = req.params;
            yield database_1.default.query("SELECT * FROM (SELECT sum(plan) as plan_total, id_serv FROM energia INNER JOIN servicios ON (energia.id_serv=servicios.id) WHERE YEAR(energia.fecha) = YEAR(?) AND MONTH(energia.fecha) = MONTH(?) GROUP BY id_serv) as tabla_total INNER JOIN energia ON (tabla_total.id_serv = energia.id_serv) INNER JOIN servicios ON (energia.id_serv = servicios.id) INNER JOIN usuario_servicio ON (servicios.id = usuario_servicio.id_servicio) INNER JOIN (SELECT sum(plan) as plan_acumulado, sum(consumo) as real_acumulado, id_serv FROM energia INNER JOIN servicios ON (energia.id_serv=servicios.id) WHERE YEAR(energia.fecha) = YEAR(?) AND MONTH(energia.fecha) = MONTH(?) AND energia.fecha <= DATE(?) GROUP BY id_serv) as tabla_acumulados ON (tabla_acumulados.id_serv=energia.id_serv) WHERE usuario_servicio.id_usuario = ? AND energia.fecha = ?", [fecha, fecha, fecha, fecha, fecha, id, fecha], function (error, results, fields) {
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
            req.body.plan_hpicd = Number(req.body.plan_hpicd);
            req.body.plan_hpicn = Number(req.body.plan_hpicn);
            req.body.lectura = Number(req.body.lectura);
            req.body.lectura_hpicd1 = Number(req.body.lectura_hpicd1);
            req.body.lectura_hpicd2 = Number(req.body.lectura_hpicd2);
            req.body.lectura_hpicn1 = Number(req.body.lectura_hpicn1);
            req.body.lectura_hpicn2 = Number(req.body.lectura_hpicn2);
            req.body.id_serv = Number(req.body.id_serv);
            let query = 'INSERT INTO energia (fecha, plan, consumo, lectura, lectura_hpicd1, lectura_hpicd2, lectura_hpicn1, lectura_hpicn2, plan_hpicd, plan_hpicn, id_serv) ';
            query += 'VALUES(\'' + req.body.fecha + '\', ' + req.body.plan + ', ' + req.body.consumo + ', ' + req.body.lectura + ', ' + req.body.lectura_hpicd1 + ', ' + req.body.lectura_hpicd2 + ', ' + req.body.lectura_hpicn1 + ', ' + req.body.lectura_hpicn2 + ', ' + req.body.plan_hpicd + ', ' + req.body.plan_hpicn + ', ' + req.body.id_serv + ');';
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
            delete req.body.id;
            delete req.body.id_serv;
            delete req.body.fecha;
            // req.body.fecha = req.body.fecha.substr(0,req.body.fecha.indexOf('T'));
            /*req.body.plan = Number(req.body.plan);
            req.body.plan_hpicd = Number(req.body.plan_hpicd);
            req.body.plan_hpicn = Number(req.body.plan_hpicn);
            req.body.lectura = Number(req.body.lectura);
            req.body.lectura_hpicd1 = Number(req.body.lectura_hpicd1);
            req.body.lectura_hpicd2 = Number(req.body.lectura_hpicd2);
            req.body.lectura_hpicn1 = Number(req.body.lectura_hpicn1);
            req.body.lectura_hpicn2 = Number(req.body.lectura_hpicn2);
            req.body.id_serv = Number(req.body.id_serv);*/
            // const query = 'UPDATE energia SET plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+', lectura_hpicd1 = '+req.body.lectura_hpicd1+', lectura_hpicd2 = '+req.body.lectura_hpicd2+', lectura_hpicn1 = '+req.body.lectura_hpicn2+', lectura_hpicd1 = '+req.body.lectura_hpicn2+', plan_hpicd = '+req.body.plan_hpicd+', plan_hpicn = '+req.body.plan_hpicn+', id_serv = '+req.body.id_serv+' WHERE id = '+id+';';
            // console.log(query);
            /*await pool.query(query, function(error: any, results: any, fields: any) {
                res.json({message: 'Energy record updated'});
            });*/
            yield database_1.default.query('UPDATE energia SET ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ message: 'Energy record updated' });
            });
        });
    }
    updateAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let updates = [];
            for (let i = 0; i < req.body.length; i++) {
                delete req.body[i].realacumulado;
                delete req.body[i].planacumulado;
                updates.push(Object.values(req.body[i]));
            }
            // console.log(updates);
            // const query = 'UPDATE energia SET fecha = \''+req.body.fecha+'\',plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
            yield database_1.default.query('INSERT INTO energia (id, fecha, plan, consumo, lectura, lectura_hpicd1, lectura_hpicd2, lectura_hpicn1, lectura_hpicn2, plan_hpicd, plan_hpicn, id_serv) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan),consumo=VALUES(consumo),lectura=VALUES(lectura),lectura_hpicd1=VALUES(lectura_hpicd1),lectura_hpicd2=VALUES(lectura_hpicd2),lectura_hpicn1=VALUES(lectura_hpicn1),lectura_hpicn2=VALUES(lectura_hpicn2),plan_hpicd=VALUES(plan_hpicd),plan_hpicn=VALUES(plan_hpicn);', [updates], function (error, results, fields) {
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
            const plan_picod = req.body.plan_picod;
            const plan_picon = req.body.plan_picon;
            const id_serv = req.body.id_serv;
            let erecords = [];
            while (moment(inicio).isSameOrBefore(fin, 'day')) {
                erecords.push([inicio, Number(plan), Number(plan_picod), Number(plan_picon), Number(id_serv)]);
                inicio = moment(inicio).add(1, 'days').format('YYYY-MM-DD');
            }
            //console.log(erecords);
            yield database_1.default.query('INSERT INTO energia (fecha, plan, plan_hpicd, plan_hpicn, id_serv) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan), plan_hpicd=VALUES(plan_hpicd), plan_hpicn=VALUES(plan_hpicn);', [erecords], function (error, results, fields) {
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
            yield database_1.default.query('UPDATE energia SET consumo = null, lectura = null, lectura_hpicd1 = null, lectura_hpicd2 = null, lectura_hpicn1 = null, lectura_hpicn2 = null WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Energy record deleted" });
            });
        });
    }
}
const energyController = new EnergyController();
exports.default = energyController;
