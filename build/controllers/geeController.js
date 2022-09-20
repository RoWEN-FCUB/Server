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
            const gees = yield database_1.default.query("SELECT * FROM gee_registro WHERE id_gee = ?;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listGEEByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gees = yield database_1.default.query("SELECT gee.id, gee.idgee FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) WHERE users.id = ?;", [id], function (error, results, fields) {
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
