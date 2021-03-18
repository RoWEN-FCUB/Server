import { Request, Response } from 'express';
import pool from '../database';

class ComercialController {
    constructor() {}

    public async listProviders (req: Request, res: Response): Promise<void>{
        const id = req.params.id_empresa;
        const prov = await pool.query("SELECT * FROM comercial_proveedor WHERE id_serv = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listProducts (req: Request, res: Response): Promise<void>{
        const id_provider = req.params.id_proveedor;
        const prod = await pool.query("SELECT * FROM comercial_producto WHERE id_proveedor = ?;", [id_provider], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listReceipts (req: Request, res: Response): Promise<void>{
        const id_provider = req.params.id_proveedor;
        const concilied = req.params.concilied;
        const delivered = req.params.delivered;
        const prod = await pool.query("SELECT comercial_vale.*, comercial_vale_productos.id_producto, comercial_vale_productos.cantidad, comercial_producto.codigo, comercial_producto.nombre, comercial_producto.descripcion, comercial_producto.unidad_medida, comercial_producto.precio, comercial_producto.mlc FROM comercial_vale INNER JOIN comercial_vale_productos ON (comercial_vale.id = comercial_vale_productos.id_vale) INNER JOIN comercial_producto ON (comercial_vale_productos.id_producto = comercial_producto.id) WHERE comercial_vale.id_proveedor = ? ORDER BY pedido DESC;", [id_provider], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listReceiptProducts (req: Request, res: Response): Promise<void>{
        const id_receipt = req.params.id_receipt;
        const prod = await pool.query("SELECT comercial_producto.*, comercial_vale_productos.cantidad as cantidad FROM comercial_producto INNER JOIN comercial_vale_productos ON (comercial_producto.id = comercial_vale_productos.id_producto) WHERE comercial_vale_productos.id_vale = ?;", [id_receipt], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async searchReceipts (req: Request, res: Response): Promise<void>{
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
                } else {
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
        } else {
            if (delivered < 3) {
                query_mod += ' AND comercial_vale.entregado = ' + delivered;
            }
            if (concilied < 3) {
                query_mod += ' AND comercial_vale.conciliado = ' + concilied;
            }
            query = 'SELECT comercial_vale.*, (SELECT SUM(cantidad) FROM comercial_vale_productos WHERE comercial_vale_productos.id_vale = comercial_vale.id) as cantidad_productos FROM comercial_vale';
            query += ' WHERE comercial_vale.id_proveedor = ' + id_provider  + query_mod + ' ORDER BY pedido DESC LIMIT 2 OFFSET ' + ((page - 1) * 2) + ';';
            query_count += ' WHERE comercial_vale.id_proveedor = ' + id_provider + query_mod + ';';
        }
        // console.log(query);
        const records = await pool.query(query, async function(error: any, receipts: any, fields: any){
            if (error) {
                console.log(error);
            }
            const reccount = await pool.query(query_count, function(error: any, count: any, fields: any){            
                let total = 0;
                if (error) {
                    console.log(error);
                }
                if(count[0].total_records) {
                    total = count[0].total_records;
                }   
                //console.log(receipts.length + ' ' + total);
                res.json({receipts, total});
            });
        });
    }

    public async createProduct(req: Request, res: Response): Promise<void>{
        delete req.body.id;        
        await pool.query('INSERT INTO comercial_producto SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Product saved'});
        });
    }

    public async createProvider(req: Request, res: Response): Promise<void>{
        delete req.body.id;        
        await pool.query('INSERT INTO comercial_proveedor SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Provider saved'});
        });
    }

    public async createReceipt(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        delete req.body.cantidad_productos;
        // console.log(req.body);
        req.body.fecha_emision = req.body.fecha_emision.substr(0,req.body.fecha_emision.indexOf('T'));
        let productos: any[] = req.body.productos;
        delete req.body.productos;
        // console.log(productos);
        await pool.query('INSERT INTO comercial_vale SET ?', [req.body], async function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            let prods = [];
            for (let i = 0; i < productos.length; i++) {
                const vale_producto = {
                    id_vale: results.insertId,
                    id_producto: productos[i].id,
                    cantidad: productos[i].cantidad,
                }
                prods.push(Object.values(vale_producto));
            }
            await pool.query('INSERT INTO comercial_vale_productos (id_vale, id_producto, cantidad) VALUES ?', [prods], function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
                res.json({message: 'Receipt saved'});
            });
        });
        //res.json({message: 'Receipt saved'});
    }

    public async updateProduct(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        // console.log(req.body);
        const result = pool.query('UPDATE comercial_producto set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Product updated"});
        });
    }

    public async updateProvider(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        // console.log(req.body);
        const result = pool.query('UPDATE comercial_proveedor set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Provider updated"});
        });
    }

    public async updateReceipt(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        delete req.body.cantidad_productos;
        // console.log(req.body);
        req.body.fecha_emision = req.body.fecha_emision.substr(0,req.body.fecha_emision.indexOf('T'));
        if (req.body.productos) {
            let productos: any[] = req.body.productos;
            delete req.body.productos;
            if (productos.length > 0) {
                const result = await pool.query('DELETE FROM comercial_vale_productos WHERE id_vale = ?', [id], async function(error: any, results: any, fields: any){            
                    await pool.query('UPDATE comercial_vale set ? WHERE id = ?', [req.body,id], async function(error: any, results: any, fields: any){            
                        let prods = [];
                        for (let i = 0; i < productos.length; i++) {
                            const vale_producto = {
                                id_vale: id,
                                id_producto: productos[i].id,
                                cantidad: productos[i].cantidad,
                            }
                            prods.push(Object.values(vale_producto));
                        }
                        await pool.query('INSERT INTO comercial_vale_productos (id_vale, id_producto, cantidad) VALUES ?', [prods], function(error: any, results: any, fields: any) {
                            if (error) {
                                console.log(error);
                            }
                            res.json({message: 'Receipt updated'});
                        });
                    });
                });
            }
        } else {
            await pool.query('UPDATE comercial_vale set ? WHERE id = ?', [req.body,id], async function(error: any, results: any, fields: any){            
                if (error) {
                    console.log(error);
                }
                res.json({message: 'Receipt updated'});
            });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM comercial_vale_productos WHERE id_producto = ?', [id], async function(error: any, results: any[], fields: any){            
            if (results.length > 0) {
                res.json({text:"Product exists"});
            } else {
                const result2 = await pool.query('DELETE FROM comercial_producto WHERE id = ?', [id], function(error: any, results: any, fields: any){            
                    res.json({text:"Product deleted"});
                }); 
            }
        }); 
    }

    public async deleteProvider(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM comercial_vale_productos INNER JOIN comercial_producto ON (comercial_vale_productos.id_producto = comercial_producto.id) WHERE comercial_producto.id_proveedor = ?', [id], async function(error: any, results: any[], fields: any){            
            if (results.length > 0) {
                res.json({text:"Provider exists"});
            } else {
                const result3 = await pool.query('DELETE FROM comercial_producto WHERE id_proveedor = ?', [id], async function(error: any, results: any, fields: any){            
                    const result2 = await pool.query('DELETE FROM comercial_proveedor WHERE id = ?', [id], function(error: any, results: any, fields: any){            
                        res.json({text:"Provider deleted"});
                    });
                }); 
            }
        }); 
    }

    public async deleteReceipt(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const result = await pool.query('DELETE FROM comercial_vale WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Receipt deleted"});
        });
    }

    public async upload(req: any, res: any): Promise<void>{
        const filename = req.files.uploads.path.split('\\').pop().split('/').pop();
        res.json({fname: filename});
    }
}
const comercialController = new ComercialController();
export default comercialController;