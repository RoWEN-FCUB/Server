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
}
const comercialController = new ComercialController();
export default comercialController;