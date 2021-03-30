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
    listMarkedReceipts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_provider = req.params.id_proveedor;
            const prod = yield database_1.default.query("SELECT comercial_vale.*, comercial_vale_productos.id_producto, comercial_vale_productos.cantidad, comercial_producto.codigo, comercial_producto.nombre, comercial_producto.descripcion, comercial_producto.unidad_medida, comercial_producto.precio, comercial_producto.mlc FROM comercial_vale INNER JOIN comercial_vale_productos ON (comercial_vale.id = comercial_vale_productos.id_vale) INNER JOIN comercial_producto ON (comercial_vale_productos.id_producto = comercial_producto.id) WHERE comercial_vale.id_proveedor = ? AND comercial_vale.marcado_conciliar = TRUE ORDER BY pedido DESC;", [id_provider], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    listReceiptProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_receipt = req.params.id_receipt;
            const prod = yield database_1.default.query("SELECT comercial_producto.*, comercial_vale_productos.cantidad as cantidad FROM comercial_producto INNER JOIN comercial_vale_productos ON (comercial_producto.id = comercial_vale_productos.id_producto) WHERE comercial_vale_productos.id_vale = ?;", [id_receipt], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    searchReceipts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_provider = req.params.id_provider;
            const concilied = Number(req.params.concilied);
            const delivered = Number(req.params.delivered);
            const str = String(req.params.str);
            const keys = str.split(' ');
            const page = Number(req.params.page);
            let query = '';
            let query_count = 'SELECT count(*) as total_records FROM comercial_vale';
            let query_mod = '';
            if (keys.length >= 0 && str !== 'null') {
                query = 'SELECT comercial_vale.*, (SELECT SUM(cantidad) FROM comercial_vale_productos WHERE comercial_vale_productos.id_vale = comercial_vale.id) as cantidad_productos FROM comercial_vale WHERE ';
                for (let i = 0; i < keys.length; i++) {
                    if (i === 0) {
                        query_mod += "(comercial_vale.pedido LIKE '%" + keys[i] + "%'";
                    }
                    else {
                        query_mod += "AND (comercial_vale.pedido LIKE '%" + keys[i] + "%'";
                    }
                    query_mod += " OR comercial_vale.precio_total LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.comprador LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.destinatario LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.destinatario_direccion LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.destinatario_telefono LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.fecha_emision LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.costo_envio LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.provincia LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.municipio LIKE '%" + keys[i] + "%'";
                    query_mod += " OR comercial_vale.fecha_emision LIKE '%" + keys[i] + "%')";
                }
                if (delivered < 3) {
                    query_mod += ' AND comercial_vale.entregado = ' + delivered;
                }
                if (concilied < 3) {
                    query_mod += ' AND comercial_vale.conciliado = ' + concilied;
                }
                query_count += ' WHERE ' + query_mod + ' AND comercial_vale.id_proveedor = ' + id_provider + ';';
                query += query_mod + ' AND comercial_vale.id_proveedor = ' + id_provider + ' ORDER BY pedido DESC LIMIT 2 OFFSET ' + ((page - 1) * 2) + ';';
            }
            else {
                if (delivered < 3) {
                    query_mod += ' AND comercial_vale.entregado = ' + delivered;
                }
                if (concilied < 3) {
                    query_mod += ' AND comercial_vale.conciliado = ' + concilied;
                }
                query = 'SELECT comercial_vale.*, (SELECT SUM(cantidad) FROM comercial_vale_productos WHERE comercial_vale_productos.id_vale = comercial_vale.id) as cantidad_productos FROM comercial_vale';
                query += ' WHERE comercial_vale.id_proveedor = ' + id_provider + query_mod + ' ORDER BY pedido DESC LIMIT 2 OFFSET ' + ((page - 1) * 2) + ';';
                query_count += ' WHERE comercial_vale.id_proveedor = ' + id_provider + query_mod + ';';
            }
            // console.log(query);
            const records = yield database_1.default.query(query, function (error, receipts, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    const reccount = yield database_1.default.query(query_count, function (error, count, fields) {
                        let total = 0;
                        if (error) {
                            console.log(error);
                        }
                        if (count[0].total_records) {
                            total = count[0].total_records;
                        }
                        //console.log(receipts.length + ' ' + total);
                        res.json({ receipts, total });
                    });
                });
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
    createConciliation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const datos = req.body.datos;
            const productos = req.body.productos;
            // const fecha = new Date().toString();
            let total_mn = 0;
            let total_usd = 0;
            let total_cl = 0;
            for (let i = 0; i < productos.length; i++) {
                total_cl += productos[i].cl;
                total_mn += productos[i].total_mn;
                total_usd += productos[i].total_usd;
            }
            const newCon = {
                id_prov: datos.id_prov,
                id_user: datos.id_user,
                fecha: datos.fecha.substr(0, datos.fecha.indexOf('T')),
                total_mn: total_mn,
                total_usd: total_usd,
                total_cl: total_cl,
                vales: datos.pedidos,
            };
            console.log(newCon);
            res.json({ message: 'Conc saved' });
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
            if (req.body.productos) {
                let productos = req.body.productos;
                delete req.body.productos;
                if (productos.length > 0) {
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
                }
            }
            else {
                yield database_1.default.query('UPDATE comercial_vale set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        res.json({ message: 'Receipt updated' });
                    });
                });
            }
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
