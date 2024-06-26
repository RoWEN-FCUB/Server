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
var fetch = require('node-fetch');
class ServiceController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_emp } = req.params;
            const tasks = yield database_1.default.query("SELECT servicios.*, empresas.siglas AS nombre_emp FROM servicios LEFT JOIN empresas ON (empresas.id = servicios.id_emp) WHERE servicios.id_emp = ? ORDER BY servicios.id;", [id_emp], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getUserServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT servicios.* FROM servicios INNER JOIN usuario_servicio ON (servicios.id = usuario_servicio.id_servicio) WHERE usuario_servicio.id_usuario = ? ORDER BY servicios.id;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    updateUserServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query("DELETE FROM usuario_servicio WHERE id_usuario = ?", [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (req.body.length > 0) {
                        yield database_1.default.query("INSERT INTO usuario_servicio (id_usuario, id_servicio) VALUES ?", [req.body], function (error, results, fields) {
                            res.json({ message: 'Service saved' });
                        });
                    }
                    else {
                        res.json({ message: 'Service saved' });
                    }
                });
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM servicios WHERE id = ?;", [id], function (error, results, fields) {
                res.json(results[0]);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO servicios SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Service saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = database_1.default.query('UPDATE servicios set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Service updated" });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield database_1.default.query('DELETE FROM servicios WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Service deleted" });
            });
        });
    }
    getGeolocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = req.params.city;
            let options = { json: true };
            const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba';
            try {
                const response = yield fetch(url, {
                    method: 'get',
                    headers: { 'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq' }
                });
                const cities = yield response.json();
                if (cities.length > 0) {
                    res.json(cities);
                }
            }
            catch (error) {
                console.log(error);
                res.status(404).json({ text: 'Error al contactar con el servidor api' });
            }
        });
    }
    getServiceDepartments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_serv } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM departamentos WHERE id_serv = ?", [id_serv], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    createDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO departamentos SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Department saved' });
            });
        });
    }
    deleteDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield database_1.default.query('DELETE FROM departamentos WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Department deleted" });
            });
        });
    }
}
const serviceController = new ServiceController();
exports.default = serviceController;
