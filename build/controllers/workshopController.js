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
            //const {id} = req.params;
            const records = yield database_1.default.query("SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) ORDER BY id DESC;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listClients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const {id} = req.params;
            const records = yield database_1.default.query("SELECT * FROM taller_clientes ORDER BY siglas;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const {id} = req.params;
            const records = yield database_1.default.query("SELECT * FROM taller_equipos;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const {id} = req.params;
            const records = yield database_1.default.query("SELECT * FROM taller_clientes_personas;", function (error, results, fields) {
                res.json(results);
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
            // console.log(notificacion);
            const notif = yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
                    // console.log(req.body);
                    yield database_1.default.query('INSERT INTO taller_registro set ?', [req.body], function (error, results, fields) {
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
            req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
            req.body.fecha_salida = req.body.fecha_salida.substring(0, req.body.fecha_salida.indexOf('T'));
            delete req.body.cliente_nombre;
            // console.log(req.body);
            const result = yield database_1.default.query('UPDATE taller_registro set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Record updated" });
            });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { str } = req.params;
            const keys = str.split(' ', 13);
            let query = '';
            // console.log(keys);
            if (keys.length >= 0) {
                query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
                if (keys.length >= 0) {
                    query += ' WHERE ';
                }
                for (let i = 0; i < keys.length; i++) {
                    if (i === 0) {
                        query += "(cliente LIKE '%" + keys[i] + "%'";
                    }
                    else {
                        query += "AND (cliente LIKE '%" + keys[i] + "%'";
                    }
                    query += " OR equipo LIKE '%" + keys[i] + "%'";
                    query += " OR marca LIKE '%" + keys[i] + "%'";
                    query += " OR modelo LIKE'%" + keys[i] + "%'";
                    query += " OR inventario LIKE '%" + keys[i] + "%'";
                    query += " OR serie LIKE '%" + keys[i] + "%'";
                    query += " OR fecha_entrada LIKE '%" + keys[i] + "%'";
                    query += " OR entregado LIKE '%" + keys[i] + "%'";
                    query += " OR ot LIKE '%" + keys[i] + "%'";
                    query += " OR estado LIKE '%" + keys[i] + "%'";
                    query += " OR especialista LIKE '%" + keys[i] + "%'";
                    query += " OR fecha_salida LIKE '%" + keys[i] + "%'";
                    query += " OR recogido LIKE '%" + keys[i] + "%'";
                    query += " OR taller_clientes.nombre LIKE '%" + keys[i] + "%')";
                }
                query += ' ORDER BY id DESC;';
            }
            else {
                query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
                query += ' ORDER BY id DESC;';
            }
            console.log(query);
            const records = yield database_1.default.query(query, function (error, results, fields) {
                res.json(results);
            });
        });
    }
}
const workshopController = new WorkshopController();
exports.default = workshopController;
