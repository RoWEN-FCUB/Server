import { Request, Response } from 'express';
import pool from '../database';

class GEEController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const gees = await pool.query("SELECT gee.id, gee.id_emp, gee.id_serv, gee.idgee, gee.marca, gee.kva, gee.ic_scarga, gee.ic_ccargad, gee.ic_ccargan, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async listRecords (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gees = await pool.query("SELECT * FROM gee_registro WHERE id_gee = ? ORDER BY id DESC;", [id], function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }
    
    public async listGEEByUser (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gees = await pool.query("SELECT gee.id, gee.idgee FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) WHERE users.id = ?;", [id], function(error: any, results: any, fields: any){            
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

    public async createFCard(req: Request, res: Response): Promise<void> {
        delete req.body.id;
        await pool.query('INSERT INTO tarjeta SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'FCard saved'});
        });
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        delete req.body.id;
        delete req.body.empresa;
        delete req.body.servicio;
        delete req.body.provincia;
        delete req.body.municipio;
        // console.log(req.body);
        const result = pool.query('UPDATE gee set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            if (error) {
                console.log(error);
            }
            res.json({text:"Gee updated"});
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