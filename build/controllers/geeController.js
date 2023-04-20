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
    getFuelPrices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('SELECT configuracion.precio_dregular as precio_dregular, configuracion.precio_gregular as precio_gregular FROM configuracion;', function (error, results, fields) {
                res.json(results[0]);
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
            const id_usuario = req.body.id_usuario;
            delete req.body.id_usuario; // delete id_usuario from request to avoid circular reference when using the function later on.
            yield database_1.default.query('SELECT * FROM configuracion', (error, configuracion, fields) => __awaiter(this, void 0, void 0, function* () {
                let precio_combustible = 0;
                if (req.body.tipo_combustible === 'Diesel Regular') {
                    precio_combustible = configuracion[0].precio_dregular;
                }
                else if (req.body.tipo_combustible === 'Gasolina') {
                    precio_combustible = configuracion[0].precio_gregular;
                }
                yield database_1.default.query('INSERT INTO tarjetas SET ?', [req.body], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        const newRecord = {
                            id_tarjeta: results.insertId,
                            id_gee: req.body.id_gee,
                            id_usuario: id_usuario,
                            fecha: new Date(),
                            sinicial_pesos: req.body.saldo,
                            sinicial_litros: geeController.round(req.body.saldo / precio_combustible, 2),
                            sfinal_pesos: req.body.saldo,
                            sfinal_litros: geeController.round(req.body.saldo / precio_combustible, 2), // round to 2 decimals, because the database only accepts numbers.
                        };
                        yield database_1.default.query('INSERT INTO tarjetas_registro SET ?', [newRecord], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                            res.json({ message: 'FCard saved' });
                        }));
                    });
                });
            }));
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
                    yield database_1.default.query('UPDATE tarjetas SET saldo = ? WHERE id = ?', [req.body.sfinal_pesos, req.body.id_tarjeta], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                        yield database_1.default.query('INSERT INTO tarjetas_registro SET ?', [req.body], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                            res.json({ message: 'FCard Record saved' });
                        }));
                    }));
                }));
            }));
        });
    }
    changeFuelPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevPrice = req.body.prevPrice; // Price before change
            const newPrice = req.body.newPrice;
            const fuelType = req.body.fuelType;
            const id_usuario = req.body.id_usuario;
            yield database_1.default.query("SELECT * FROM tarjetas WHERE tipo_combustible = ?;", [fuelType], function (error, tarjetas, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    let new_records = [];
                    for (let i = 0; i < tarjetas.length; i++) {
                        let record = [
                            tarjetas[i].id,
                            tarjetas[i].id_gee,
                            id_usuario,
                            new Date(),
                            tarjetas[i].saldo,
                            geeController.round(tarjetas[i].saldo / prevPrice, 2),
                            tarjetas[i].saldo,
                            geeController.round(tarjetas[i].saldo / newPrice, 2),
                            'Cambio de precio del ' + fuelType + ' de ' + prevPrice + ' a ' + newPrice,
                        ];
                        new_records.push(record);
                    }
                    yield database_1.default.query('INSERT INTO tarjetas_registro(id_tarjeta, id_gee, id_usuario, fecha, sinicial_pesos, sinicial_litros, sfinal_pesos, sfinal_litros, observacion) VALUES ?', [new_records], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let query = 'UPDATE configuracion SET ';
                            if (fuelType === 'Diesel Regular') {
                                query += 'precio_dregular';
                            }
                            else if (fuelType === 'Gasolina') {
                                query += 'precio_gregular';
                            }
                            query += ' = ?'; // Price after change,
                            yield database_1.default.query(query, [newPrice], function (error, result, fields) {
                                res.json({ text: "Price updated" });
                            });
                        });
                    });
                });
            });
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
    deleteCardRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gee = yield database_1.default.query('DELETE FROM tarjetas_registro WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "CardRecord deleted" });
            });
        });
    }
}
const geeController = new GEEController();
exports.default = geeController;
