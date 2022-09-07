import { Request, Response } from 'express';
import pool from '../database';

class GEEController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const gees = await pool.query("SELECT gee.id, gee.id_emp, gee.id_serv, gee.idgee, gee.marca, gee.kva, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        await pool.query('INSERT INTO gee SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'GEE saved'});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gee = await pool.query('DELETE FROM gee WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"GEE deleted"});
        });        
    }
}
const geeController = new GEEController();
export default geeController;