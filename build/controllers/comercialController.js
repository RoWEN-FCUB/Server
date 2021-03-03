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
class ComercialController {
    constructor() { }
    listProviders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empresa;
            const prov = yield database_1.default.query("SELECT * FROM comercial_proveedor WHERE id_empresa = ?;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_provider = req.params.id_proveedor;
            const prod = yield database_1.default.query("SELECT * FROM comercial_producto WHERE id_proveedor = ?;", [id_provider], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listReceipts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_provider = req.params.id_proveedor;
            const concilied = req.params.concilied;
            const delivered = req.params.delivered;
            const prod = yield database_1.default.query("SELECT comercial_vale.*, comercial_vale_productos.id_producto, comercial_vale_productos.cantidad, comercial_producto.codigo, comercial_producto.nombre, comercial_producto.descripcion, comercial_producto.unidad_medida, comercial_producto.precio, comercial_producto.mlc FROM comercial_vale INNER JOIN comercial_vale_productos ON (comercial_vale.id = comercial_vale_productos.id_vale) INNER JOIN comercial_producto ON (comercial_vale_productos.id_producto = comercial_producto.id) WHERE comercial_vale.id_proveedor = ? ORDER BY pedido DESC;", [id_provider], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO comercial_producto SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Product saved' });
            });
        });
    }
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = req.files.uploads.path.split('\\').pop().split('/').pop();
            res.json({ fname: filename });
        });
    }
}
const comercialController = new ComercialController();
exports.default = comercialController;
