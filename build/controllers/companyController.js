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
class CompanyController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield database_1.default.query("SELECT * FROM empresas;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT * FROM empresas WHERE id = ?;", [id], function (error, results, fields) {
                res.json(results[0]);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO empresas SET ?', [req.body], function (error, results, fields) {
                res.json({ message: 'Company saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = database_1.default.query('UPDATE empresas set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Company updated" });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield database_1.default.query('DELETE FROM empresas WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Company deleted" });
            });
        });
    }
}
const companyController = new CompanyController();
exports.default = companyController;
