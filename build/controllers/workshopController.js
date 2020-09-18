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
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield database_1.default.query('UPDATE taller_registro set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Record updated" });
            });
        });
    }
}
const workshopController = new WorkshopController();
exports.default = workshopController;
