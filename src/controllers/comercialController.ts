import { Request, Response } from 'express';
import pool from '../database';

class ComercialController {
    constructor() {}

    public async listProviders (req: Request, res: Response): Promise<void>{
        const id = req.params.id_empresa;
        const tasks = await pool.query("SELECT * FROM comercial_proveedor WHERE id_empresa = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }
}
const comercialController = new ComercialController();
export default comercialController;