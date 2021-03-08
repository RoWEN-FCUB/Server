import { Request, Response } from 'express';
import pool from '../database';

class ComercialController {
    constructor() {}

    public async listProviders (req: Request, res: Response): Promise<void>{
        const id = req.params.id_empresa;
        const prov = await pool.query("SELECT * FROM comercial_proveedor WHERE id_empresa = ?;", [id], function(error: any, results: any, fields: any){
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

    public async upload(req: any, res: any): Promise<void>{
        const filename = req.files.uploads.path.split('\\').pop().split('/').pop();
        res.json({fname: filename});
    }
}
const comercialController = new ComercialController();
export default comercialController;