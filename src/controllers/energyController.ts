import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');

class EnergyController {
    constructor() {}

    public async list (req: Request,res: Response): Promise<void>{
        const {month} = req.params;
        const {year} = req.params;
        const tasks = await pool.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ?;", [year, month], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getReading (req: Request,res: Response): Promise<void>{
        const {date} = req.params;        
        const tasks = await pool.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? ORDER BY lectura DESC LIMIT 1 ", [date], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        delete req.body.planacumulado;
        delete req.body.realacumulado;
        req.body.fecha = req.body.fecha.substr(0,req.body.fecha.indexOf('T'));
        req.body.plan = Number(req.body.plan);
        req.body.lectura = Number(req.body.lectura);
        const query = 'INSERT INTO energia (fecha, plan, consumo, lectura) VALUES(\''+req.body.fecha+'\', '+req.body.plan+', '+req.body.consumo+', '+req.body.lectura+');';
        await pool.query(query, function(error: any, results: any, fields: any) {
            res.json({message: 'Energy record saved'});
        });
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        let oldpass = '';
                            
    }
}

const energyController = new EnergyController();
export default energyController;