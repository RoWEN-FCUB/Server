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
class GEEController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gees = yield database_1.default.query("SELECT gee.*, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getFuelTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*await pool.query('SELECT configuracion.precio_dregular as precio_dregular, configuracion.precio_gregular as precio_gregular FROM configuracion;', function(error: any, results: any, fields: any){
                res.json(results[0]);
            });*/
            yield database_1.default.query('SELECT * FROM tipos_combustibles;', function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getFuelExistenceByGee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_gee } = req.params;
            let existence = 0;
            yield database_1.default.query("SELECT SUM(sfinal_litros) as saldofinal FROM (SELECT id, sfinal_litros FROM tarjetas_registro WHERE id_gee = ? HAVING id IN (SELECT max(id) FROM tarjetas_registro WHERE id_gee = ? GROUP BY id_tarjeta)) as subquery", [id_gee, id_gee], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (results.length > 0) {
                        console.log(results);
                        existence += results[0].saldofinal; // saldofinal en tarjetas
                    }
                    yield database_1.default.query("SELECT existencia FROM gee_tanque WHERE id_gee = ? ORDER BY id DESC LIMIT 1", [id_gee], function (error, results, fields) {
                        if (results.length > 0) {
                            console.log(results);
                            existence += results[0].existencia; // existencia en tanque
                        }
                        res.json({ existencia: existence });
                    });
                });
            });
        });
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const page = Number(req.params.page);
            const limit = Number(req.params.limit);
            yield database_1.default.query("SELECT count(id) as total_records FROM gee_registro WHERE id_gee = ?;", [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    const count = results[0].total_records;
                    yield database_1.default.query("SELECT * FROM gee_registro WHERE id_gee = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id, limit, ((page - 1) * limit)], (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        res.json({ records: results, total_items: count });
                    });
                });
            });
        });
    }
    listGEEByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query("SELECT gee.*, servicios.nombre as servicio, empresas.siglas as empresa, empresas.oace as oace FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) INNER JOIN servicios ON (gee.id_serv = servicios.id) INNER JOIN empresas ON (servicios.id_emp = empresas.id) WHERE users.id = ?;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listCardsbyGEE(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_gee } = req.params;
            yield database_1.default.query("SELECT tarjetas.*, tipos_combustibles.precio AS precio_combustible FROM tarjetas LEFT JOIN tipos_combustibles ON (tarjetas.tipo_combustible = tipos_combustibles.id) WHERE id_gee = ?;", [id_gee], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listTanksbyGEE(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_gee = Number(req.params.id_gee);
            const page = Number(req.params.page);
            const limit = Number(req.params.limit);
            yield database_1.default.query("SELECT count(id) as total_records FROM gee_tanque WHERE id_gee = ?;", [id_gee], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                const count = results[0].total_records;
                yield database_1.default.query("SELECT * FROM gee_tanque WHERE id_gee = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id_gee, limit, ((page - 1) * limit)], function (error, results, fields) {
                    res.json({ records: results, total_items: count });
                });
            }));
        });
    }
    listCardsRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_card = Number(req.params.id_card);
            const page = Number(req.params.page);
            const limit = Number(req.params.limit);
            yield database_1.default.query("SELECT count(*) as total_records FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id DESC;", [id_card], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                const count = results[0].total_records;
                yield database_1.default.query("SELECT * FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id_card, limit, ((page - 1) * limit)], function (error, results, fields) {
                    res.json({ records: results, total_items: count });
                });
            }));
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
    createGRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //let tank_records: any[] = [];
            for (let i = 0; i < req.body.length; i++) {
                req.body[i][6] = (0, moment_1.default)(req.body[i][6]).format('HH:mm');
                req.body[i][7] = (0, moment_1.default)(req.body[i][7]).format('HH:mm');
                /*let tank_record = [req.body[i][0], '20' + req.body[i][4] + '/' + req.body[i][3] + '/' + req.body[i][2], req.body[i][12], req.body[i][1]];
                tank_records.push(tank_record);*/
            }
            yield database_1.default.query('INSERT INTO gee_registro (id_gee, id_usuario, D, M, A, tipo, hora_inicial, hora_final, horametro_inicial, horametro_final, tiempo_trabajado, energia_generada, combustible_consumido, combustible_existencia, observaciones) VALUES ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'GEE Record saved' });
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
                            sfinal_litros: geeController.round(req.body.saldo / precio_combustible, 2),
                            observacion: 'Tarjeta agregada al registro.'
                        };
                        yield database_1.default.query('INSERT INTO tarjetas_registro SET ?', [newRecord], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                            if (errors) {
                                console.log(error);
                            }
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
            delete req.body.precio_combustible;
            req.body.fecha = req.body.fecha.substring(0, req.body.fecha.indexOf('T'));
            //console.log(req.body);
            yield database_1.default.query('INSERT INTO tarjetas_registro SET ?', [req.body], (errors, result, fields) => __awaiter(this, void 0, void 0, function* () {
                res.json({ message: 'FCard Record saved' });
            }));
        });
    }
    changeFuelPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const newfuel = req.body.fuel;
            const prevprice = req.body.prevprice;
            const id_usuario = req.body.id_usuario;
            yield database_1.default.query("SELECT * FROM tarjetas WHERE tipo_combustible = ?;", [newfuel.id], function (error, tarjetas, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    let new_records = [];
                    for (let i = 0; i < tarjetas.length; i++) {
                        let record = [
                            tarjetas[i].id,
                            tarjetas[i].id_gee,
                            id_usuario,
                            new Date(),
                            tarjetas[i].saldo,
                            geeController.round(tarjetas[i].saldo / prevprice, 2),
                            tarjetas[i].saldo,
                            geeController.round(tarjetas[i].saldo / newfuel.precio, 2),
                            'Cambio de precio del ' + newfuel.tipo_combustible + ' de ' + prevprice + ' a ' + newfuel.precio,
                        ];
                        new_records.push(record);
                    }
                    yield database_1.default.query('INSERT INTO tarjetas_registro(id_tarjeta, id_gee, id_usuario, fecha, sinicial_pesos, sinicial_litros, sfinal_pesos, sfinal_litros, observacion) VALUES ?', [new_records], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield database_1.default.query('UPDATE tipos_combustibles SET ? WHERE id = ?', [newfuel, newfuel.id], function (error, result, fields) {
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
            console.log(req.body);
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
            yield database_1.default.query('DELETE FROM gee WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "GEE deleted" });
            });
        });
    }
    deleteGEERecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM gee_registro WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "GEERecord deleted" });
            });
        });
    }
    deleteCardRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM tarjetas_registro WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "CardRecord deleted" });
            });
        });
    }
    deleteFuelCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //id de la tarjeta a borrar.
            yield database_1.default.query('DELETE FROM tarjetas_registro WHERE id_tarjeta = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('DELETE FROM tarjetas WHERE id = ?', [id], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            res.json({ text: "Card deleted" });
                        });
                    });
                });
            });
        });
    }
}
const geeController = new GEEController();
exports.default = geeController;
