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
class GEEController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gees = yield database_1.default.query("SELECT gee.id, gee.id_emp, gee.id_serv, gee.idgee, gee.marca, gee.kva, gee.ic_scarga, gee.ic_ccargad, gee.ic_ccargan, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gees = yield database_1.default.query("SELECT * FROM gee_registro WHERE id_gee = ? ORDER BY id DESC;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listGEEByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gees = yield database_1.default.query("SELECT gee.*, servicios.nombre as servicio, empresas.siglas as empresa, empresas.oace as oace FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) INNER JOIN servicios ON (gee.id_serv = servicios.id) INNER JOIN empresas ON (servicios.id_emp = empresas.id) WHERE users.id = ?;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listCardsbyGEE(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_gee } = req.params;
            const gees = yield database_1.default.query("SELECT * FROM tarjetas WHERE id_gee = ?;", [id_gee], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listCardsRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_card } = req.params;
            const gees = yield database_1.default.query("SELECT * FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id ASC;", [id_card], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO gee SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'GEE saved' });
            });
        });
    }
    createFCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO tarjetas SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'FCard saved' });
            });
        });
    }
    createCardRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            req.body.fecha = req.body.fecha.substring(0, req.body.fecha.indexOf('T'));
            yield database_1.default.query('SELECT tipo_combustible FROM tarjetas WHERE id = ?', [req.body.id_tarjeta], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                const tipo_combustible = results[0].tipo_combustible;
                console.log(tipo_combustible);
                yield database_1.default.query('SELECT * FROM configuracion', (error, configuracion, fields) => __awaiter(this, void 0, void 0, function* () {
                    let precio_combustible = 0;
                    console.log(configuracion);
                    if (tipo_combustible === 'Diesel Regular') {
                        precio_combustible = configuracion[0].precio_dregular;
                    }
                    else if (tipo_combustible === 'Gasolina') {
                        precio_combustible = configuracion[0].precio_gregular;
                    }
                    req.body.sinicial_litros = geeController.round(req.body.sinicial_pesos / precio_combustible, 2);
                    req.body.sfinal_litros = geeController.round(req.body.sfinal_pesos / precio_combustible, 2);
                    if (req.body.recarga_pesos) {
                        req.body.recarga_litros = geeController.round(req.body.recarga_pesos / precio_combustible, 2);
                        req.body.saldo_litros = geeController.round(req.body.saldo_pesos / precio_combustible, 2);
                    }
                    if (req.body.consumo_pesos) {
                        req.body.consumo_litros = geeController.round(req.body.consumo_pesos / precio_combustible, 2);
                    }
                    console.log(req.body);
                    yield database_1.default.query('INSERT INTO tarjetas_registro SET ?', [req.body], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                        res.json({ message: 'FCard Record saved' });
                    }));
                }));
            }));
        });
    }
    round(numb, precision) {
        const exp = Math.pow(10, precision);
        return Math.round((numb + Number.EPSILON) * exp) / exp;
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.id;
            delete req.body.empresa;
            delete req.body.servicio;
            delete req.body.provincia;
            delete req.body.municipio;
            // console.log(req.body);
            const result = database_1.default.query('UPDATE gee set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ text: "Gee updated" });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gee = yield database_1.default.query('DELETE FROM gee WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "GEE deleted" });
            });
        });
    }
}
const geeController = new GEEController();
exports.default = geeController;
