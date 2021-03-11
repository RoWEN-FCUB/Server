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
            const prov = yield database_1.default.query("SELECT * FROM comercial_proveedor WHERE id_serv = ?;", [id], function (error, results, fields) {
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
    createProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            yield database_1.default.query('INSERT INTO comercial_proveedor SET ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'Provider saved' });
            });
        });
    }
    createReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.id;
            delete req.body.cantidad_productos;
            // console.log(req.body);
            req.body.fecha_emision = req.body.fecha_emision.substr(0, req.body.fecha_emision.indexOf('T'));
            let productos = req.body.productos;
            delete req.body.productos;
            // console.log(productos);
            yield database_1.default.query('INSERT INTO comercial_vale SET ?', [req.body], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    let prods = [];
                    for (let i = 0; i < productos.length; i++) {
                        const vale_producto = {
                            id_vale: results.insertId,
                            id_producto: productos[i].id,
                            cantidad: productos[i].cantidad,
                        };
                        prods.push(Object.values(vale_producto));
                    }
                    yield database_1.default.query('INSERT INTO comercial_vale_productos (id_vale, id_producto, cantidad) VALUES ?', [prods], function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        res.json({ message: 'Receipt saved' });
                    });
                });
            });
            //res.json({message: 'Receipt saved'});
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(req.body);
            const result = database_1.default.query('UPDATE comercial_producto set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Product updated" });
            });
        });
    }
    updateProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(req.body);
            const result = database_1.default.query('UPDATE comercial_proveedor set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                res.json({ text: "Provider updated" });
            });
        });
    }
    updateReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.cantidad_productos;
            // console.log(req.body);
            req.body.fecha_emision = req.body.fecha_emision.substr(0, req.body.fecha_emision.indexOf('T'));
            let productos = req.body.productos;
            delete req.body.productos;
            const result = yield database_1.default.query('DELETE FROM comercial_vale_productos WHERE id_vale = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('UPDATE comercial_vale set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let prods = [];
                            for (let i = 0; i < productos.length; i++) {
                                const vale_producto = {
                                    id_vale: id,
                                    id_producto: productos[i].id,
                                    cantidad: productos[i].cantidad,
                                };
                                prods.push(Object.values(vale_producto));
                            }
                            yield database_1.default.query('INSERT INTO comercial_vale_productos (id_vale, id_producto, cantidad) VALUES ?', [prods], function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                res.json({ message: 'Receipt updated' });
                            });
                        });
                    });
                });
            });
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield database_1.default.query('SELECT * FROM comercial_vale_productos WHERE id_producto = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (results.length > 0) {
                        res.json({ text: "Product exists" });
                    }
                    else {
                        const result2 = yield database_1.default.query('DELETE FROM comercial_producto WHERE id = ?', [id], function (error, results, fields) {
                            res.json({ text: "Product deleted" });
                        });
                    }
                });
            });
        });
    }
    deleteProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield database_1.default.query('SELECT * FROM comercial_vale_productos INNER JOIN comercial_producto ON (comercial_vale_productos.id_producto = comercial_producto.id) WHERE comercial_producto.id_proveedor = ?', [id], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (results.length > 0) {
                        res.json({ text: "Provider exists" });
                    }
                    else {
                        const result3 = yield database_1.default.query('DELETE FROM comercial_producto WHERE id_proveedor = ?', [id], function (error, results, fields) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const result2 = yield database_1.default.query('DELETE FROM comercial_proveedor WHERE id = ?', [id], function (error, results, fields) {
                                    res.json({ text: "Provider deleted" });
                                });
                            });
                        });
                    }
                });
            });
        });
    }
    deleteReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield database_1.default.query('DELETE FROM comercial_vale WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Receipt deleted" });
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
