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
class WorkshopController {
    constructor() { }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.params.page);
            const id_emp = Number(req.params.id_emp);
            const records = yield database_1.default.query("SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE id_emp = ? ORDER BY id DESC LIMIT 10 OFFSET ?;", [id_emp, ((page - 1) * 10)], function (error, wrecords, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    const reccount = yield database_1.default.query("SELECT count(*) as total_records FROM taller_registro;", function (error, count, fields) {
                        const total = count[0].total_records;
                        res.json({ wrecords, total });
                    });
                });
            });
        });
    }
    listParts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_reg = Number(req.params.id_reg);
            const records = yield database_1.default.query("SELECT * FROM taller_registro_partes WHERE id_reg = ?;", [id_reg], function (error, results, fields) {
                // console.log('Probando' + results)
                res.json(results);
            });
        });
    }
    listAllParts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield database_1.default.query("SELECT DISTINCT(parte) FROM taller_registro_partes;", function (error, results, fields) {
                // console.log('Probando' + results)
                res.json(results);
            });
        });
    }
    listPartMarcs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const part = req.params.part;
            const records = yield database_1.default.query("SELECT DISTINCT(marca) FROM taller_registro_partes WHERE parte = ?;", [part], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listPartModels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const part = req.params.part;
            const marc = req.params.marc;
            const records = yield database_1.default.query("SELECT DISTINCT(modelo) FROM taller_registro_partes WHERE parte = ? AND marca = ?;", [part, marc], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listPartCaps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const part = req.params.part;
            const records = yield database_1.default.query("SELECT DISTINCT(capacidad) FROM taller_registro_partes WHERE parte = ?;", [part], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listClients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield database_1.default.query("SELECT * FROM taller_clientes ORDER BY siglas;", function (error, results, fields) {
                // console.log('Probando' + results)
                res.json(results);
            });
        });
    }
    listDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield database_1.default.query("SELECT DISTINCT(equipo) FROM taller_equipos;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listMarcs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const equipo = req.params.equipo;
            const records = yield database_1.default.query("SELECT DISTINCT(marca) FROM taller_equipos WHERE equipo = ?;", equipo, function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listModels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const equipo = req.params.equipo;
            const marca = req.params.marca;
            const records = yield database_1.default.query("SELECT DISTINCT(modelo) FROM taller_equipos WHERE equipo = ? AND marca = ?;", [equipo, marca], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listSerialsInv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const equipo = req.params.equipo;
            const marca = req.params.marca;
            const modelo = req.params.modelo;
            const records = yield database_1.default.query("SELECT serie, inventario FROM taller_equipos WHERE equipo = ? AND marca = ? AND modelo = ?;", [equipo, marca, modelo], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_cliente = req.params.id_cliente;
            const records = yield database_1.default.query("SELECT * FROM taller_clientes_personas WHERE id_cliente = ?;", [id_cliente], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listPerson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ci = req.params.ci;
            const records = yield database_1.default.query("SELECT * FROM taller_clientes_personas WHERE ci = ?;", [ci], function (error, results, fields) {
                res.json(results[0]);
            });
        });
    }
    createWPerson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const siglas = req.params.siglas;
            database_1.default.query('SELECT id FROM taller_clientes WHERE siglas =  ?', siglas, function (error, id, fields) {
                if (error) {
                    console.log(error);
                }
                // console.log(id);
                req.body.id_cliente = id[0].id;
                database_1.default.query('INSERT INTO taller_clientes_personas set ?', req.body, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    res.json({ message: 'Person created' });
                });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.cliente_nombre !== '') {
                const new_client = { siglas: req.body.cliente, nombre: req.body.cliente_nombre };
                database_1.default.query('INSERT INTO taller_clientes set ?', new_client, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            delete req.body.cliente_nombre;
            const id_superior = req.body.id_superior;
            delete req.body.id_superior;
            delete req.body.entrega_ci;
            delete req.body.recoge_ci;
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            newDate.setHours(hours - offset);
            let notificacion = {
                id_usuario: id_superior,
                notificacion: '<b>' + req.body.especialista + '</b> le ha dado entrada al equipo: <b>' + req.body.equipo + ' ' + req.body.marca + '</b>.',
                fecha: newDate.toISOString(),
                leida: false,
                vinculo: '/workshop',
                estatus: 'info',
            };
            notificacion.fecha = notificacion.fecha.substring(0, notificacion.fecha.indexOf('T'));
            const notif = yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results1, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
                    yield database_1.default.query('INSERT INTO taller_registro set ?', [req.body], function (error, _results2, fields) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            res.json({ message: 'Registro salvado' });
                        }
                    });
                });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.entrega_ci;
            req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
            req.body.fecha_salida = req.body.fecha_salida.substring(0, req.body.fecha_salida.indexOf('T'));
            delete req.body.cliente_nombre;
            delete req.body.recoge_ci;
            // console.log(req.body);
            const result = yield database_1.default.query('UPDATE taller_registro set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Record updated" });
            });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = String(req.params.str);
            const page = Number(req.params.page);
            const id_emp = Number(req.params.id_emp);
            const keys = str.split(' ', 13);
            let query = '';
            let query_count = 'SELECT count(*) as total_records FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
            let query_mod = '';
            if (keys.length >= 0 && str !== 'null') {
                query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE ';
                for (let i = 0; i < keys.length; i++) {
                    if (i === 0) {
                        query_mod += "(cliente LIKE '%" + keys[i] + "%'";
                    }
                    else {
                        query_mod += "AND (cliente LIKE '%" + keys[i] + "%'";
                    }
                    query_mod += " OR equipo LIKE '%" + keys[i] + "%'";
                    query_mod += " OR marca LIKE '%" + keys[i] + "%'";
                    query_mod += " OR modelo LIKE'%" + keys[i] + "%'";
                    query_mod += " OR inventario LIKE '%" + keys[i] + "%'";
                    query_mod += " OR serie LIKE '%" + keys[i] + "%'";
                    query_mod += " OR fecha_entrada LIKE '%" + keys[i] + "%'";
                    query_mod += " OR entregado LIKE '%" + keys[i] + "%'";
                    query_mod += " OR ot LIKE '%" + keys[i] + "%'";
                    query_mod += " OR estado LIKE '%" + keys[i] + "%'";
                    query_mod += " OR especialista LIKE '%" + keys[i] + "%'";
                    query_mod += " OR fecha_salida LIKE '%" + keys[i] + "%'";
                    query_mod += " OR recogido LIKE '%" + keys[i] + "%'";
                    query_mod += " OR taller_clientes.nombre LIKE '%" + keys[i] + "%')";
                }
                query_count += ' WHERE ' + query_mod + ' AND id_emp = ' + id_emp + ';';
                query += query_mod + ' AND id_emp = ' + id_emp + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
            }
            else {
                query = 'SELECT taller_registro.id, taller_registro.cod, taller_registro.cliente, taller_registro.equipo, taller_registro.marca, taller_registro.modelo, taller_registro.inventario, taller_registro.serie, taller_registro.fecha_entrada, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.entregado) AS entregado, taller_registro.entregado AS entrega_ci, taller_registro.ot, taller_registro.estado, taller_registro.especialista, taller_registro.fecha_salida, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.recogido) AS recogido, taller_registro.recogido AS recoge_ci, taller_registro.id_emp, taller_registro.fallo, taller_registro.observaciones, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
                query += ' WHERE id_emp = ' + id_emp + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
                query_count += ' WHERE id_emp = ' + id_emp + ';';
            }
            // console.log(query_count);
            const records = yield database_1.default.query(query, function (error, wrecords, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    const reccount = yield database_1.default.query(query_count, function (error, count, fields) {
                        let total = 0;
                        if (count[0].total_records) {
                            total = count[0].total_records;
                        }
                        // console.log(wrecords);
                        res.json({ wrecords, total });
                    });
                });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM taller_registro WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "WRecord deleted" });
            });
        });
    }
    deletePart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM taller_registro_partes WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "WPart deleted" });
            });
        });
    }
    deleteWDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { wdev } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM taller_equipos WHERE equipo = ?', [wdev], function (error, results, fields) {
                res.json({ text: "WDevice deleted" });
            });
        });
    }
    deleteWPerson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM taller_clientes_personas WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "WPerson deleted" });
            });
        });
    }
    deleteWCLient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const reccount = yield database_1.default.query('DELETE FROM taller_clientes_personas WHERE id_cliente = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    const reccount = yield database_1.default.query('DELETE FROM taller_clientes WHERE id = ?', [id], function (error, results, fields) {
                        res.json({ text: "WClient deleted" });
                    });
                });
            });
        });
    }
    updateParts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            let updates = [];
            for (let i = 0; i < req.body.length; i++) {
                updates.push(Object.values(req.body[i]));
            }
            if (updates.length > 0) {
                yield database_1.default.query('INSERT INTO taller_registro_partes VALUES ? ON DUPLICATE KEY UPDATE parte = VALUES(parte), marca = VALUES(marca), modelo = VALUES(modelo), capacidad = VALUES(capacidad), cantidad = VALUES(cantidad), serie = VALUES(serie), id_reg = VALUES(id_reg);', [updates], function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    res.json({ message: 'Workshop parts updated' });
                });
            }
            res.json({ message: 'Workshop parts updated' });
        });
    }
}
const workshopController = new WorkshopController();
exports.default = workshopController;
