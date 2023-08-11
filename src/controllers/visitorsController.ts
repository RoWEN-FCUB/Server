import { Request, Response } from 'express';
import moment from 'moment';
import pool from '../database';

class VisitorsController {

    constructor() {}

    public async listAll (req: Request,res: Response): Promise<void>{
        const page = Number(req.params.page);
        const id_serv = Number(req.params.id_serv);
        await pool.query("SELECT visitantes.*, users.user as nombre_autoriza FROM visitantes INNER JOIN users ON (visitantes.autoriza = users.id) WHERE id_servicio = ? ORDER BY id DESC LIMIT 10 OFFSET ?;", [id_serv, ((page - 1) * 10)], async function(error: any, vrecords: any, fields: any){            
            await pool.query("SELECT count(*) as total_records FROM visitantes WHERE id_servicio = ?;", [id_serv], function(error: any, count: any, fields: any){            
                const total = count[0].total_records;               
                res.json({vrecords, total});
            });
        });
    }

    public async listOne(req: Request, res: Response): Promise<void>{
        const ci = Number(req.params.ci);
        await pool.query("SELECT * FROM visitantes WHERE ci = ? LIMIT 1;", [ci], function(error: any, visitor: any, fields: any){                        
            if (visitor.length > 0) {
                res.json(visitor[0]);
            } else {
                res.json(null);
            }            
        })
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        if (req.body.hora_salida) {
            req.body.hora_salida = moment(req.body.hora_salida).format('HH:mm');
        }
        req.body.hora_entrada = moment(req.body.hora_entrada).format('HH:mm');
        await pool.query('INSERT INTO visitantes SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Visitor saved'});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const reccount = await pool.query('DELETE FROM visitantes WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Visitor deleted"});
        });
    }
}

const visitorsController = new VisitorsController();
export default visitorsController;