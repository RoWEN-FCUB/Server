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
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../database"));
class VisitorsController {
    constructor() { }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.params.page);
            const id_serv = Number(req.params.id_serv);
            yield database_1.default.query("SELECT visitantes.*, users.user as nombre_autoriza FROM visitantes INNER JOIN users ON (visitantes.autoriza = users.id) WHERE id_servicio = ? ORDER BY id DESC LIMIT 10 OFFSET ?;", [id_serv, ((page - 1) * 10)], function (error, vrecords, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query("SELECT count(*) as total_records FROM visitantes WHERE id_servicio = ?;", [id_serv], function (error, count, fields) {
                        const total = count[0].total_records;
                        res.json({ vrecords, total });
                    });
                });
            });
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ci = Number(req.params.ci);
            yield database_1.default.query("SELECT * FROM visitantes WHERE ci = ? LIMIT 1;", [ci], function (error, visitor, fields) {
                if (visitor.length > 0) {
                    res.json(visitor[0]);
                }
                else {
                    res.json(null);
                }
            });
        });
    }
    listNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_serv = Number(req.params.id_serv);
            yield database_1.default.query("SELECT DISTINCT nombre, organismo, ci, departamento FROM visitantes WHERE id_servicio = ?;", [id_serv], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json(results);
            });
        });
    }
    filterVisitors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_serv = Number(req.params.id_serv);
            const page = Number(req.params.page);
            let query = "SELECT visitantes.*, users.user as nombre_autoriza FROM visitantes INNER JOIN users ON (visitantes.autoriza = users.id) WHERE id_servicio = ?";
            let params = '';
            if (req.body.nombre) {
                params += " AND visitantes.nombre LIKE '%" + req.body.nombre + "%'";
            }
            if (req.body.ci) {
                params += " AND visitantes.ci LIKE '%" + req.body.ci + "%'";
            }
            if (req.body.organismo) {
                params += " AND visitantes.organismo = '" + req.body.organismo + "'";
            }
            if (req.body.departamento) {
                params += " AND visitantes.departamento LIKE '%" + req.body.departamento + "%'";
            }
            if (req.body.fecha) {
                params += " AND visitantes.DATE(fecha) = " + "'" + (0, moment_1.default)(req.body.fecha).format('YYYY-MM-DD') + "'";
            }
            if (req.body.hora_entrada) {
                req.body.hora_entrada = (0, moment_1.default)(req.body.hora_entrada).format('HH:mm');
                params += " AND visitantes.hora_entrada LIKE '%" + req.body.hora_entrada + "%'";
            }
            if (req.body.hora_salida) {
                req.body.hora_salida = (0, moment_1.default)(req.body.hora_salida).format('HH:mm');
                params += " AND visitantes.hora_salida LIKE '%" + req.body.hora_salida + "%'";
            }
            query += params + " ORDER BY id DESC LIMIT 10 OFFSET ?;";
            console.log(query);
            yield database_1.default.query(query, [id_serv, ((page - 1) * 10)], function (error, vrecords, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query("SELECT count(*) as total_records FROM visitantes WHERE id_servicio = ?" + params + ";", [id_serv], function (error, count, fields) {
                        const total = count[0].total_records;
                        res.json({ vrecords, total });
                    });
                });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            req.body.fecha = (0, moment_1.default)(req.body.fecha).format('YYYY-MM-DD');
            if (req.body.hora_salida) {
                req.body.hora_salida = (0, moment_1.default)(req.body.hora_salida).format('HH:mm');
            }
            req.body.hora_entrada = (0, moment_1.default)(req.body.hora_entrada).format('HH:mm');
            yield database_1.default.query('INSERT INTO visitantes SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Visitor saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            req.body.hora_salida = (0, moment_1.default)(req.body.hora_salida).format('HH:mm');
            delete req.body.id;
            delete req.body.nombre_autoriza;
            const result = database_1.default.query('UPDATE visitantes set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ text: "Visitor updated" });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM visitantes WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Visitor deleted" });
            });
        });
    }
}
const visitorsController = new VisitorsController();
exports.default = visitorsController;
