import { Request, Response } from 'express';
import pool from '../database';

class ServiceController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const tasks = await pool.query("SELECT servicios.*, empresas.siglas AS nombre_emp FROM servicios LEFT JOIN empresas ON (empresas.id = servicios.id_emp);", function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async userServices (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT servicios.* FROM servicios INNER JOIN usuario_servicio ON (servicios.id = usuario_servicio.id_servicio) WHERE usuario_servicio.id_usuario = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getOne (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT * FROM servicios WHERE id = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results[0]);
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        console.log(req.body);
        await pool.query('INSERT INTO servicios SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Service saved'});
        });
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        console.log(req.body);
        const result = pool.query('UPDATE servicios set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Service updated"});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const company = await pool.query('DELETE FROM servicios WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Service deleted"});
        });        
    }
}
const serviceController = new ServiceController();
export default serviceController;