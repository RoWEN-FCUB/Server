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
        delete req.body.planacumulado;
        delete req.body.realacumulado;
        // req.body.fecha = req.body.fecha.substr(0,req.body.fecha.indexOf('T'));
        req.body.plan = Number(req.body.plan);
        req.body.lectura = Number(req.body.lectura);
        const query = 'UPDATE energia SET plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
        await pool.query(query, function(error: any, results: any, fields: any) {
            res.json({message: 'Energy record updated'});
        });
    }

    public async updateAll(req: Request, res: Response): Promise<void>{
        let updates = [];
        for (let i = 0; i < req.body.length; i++) {
            delete req.body[i].fecha;
            delete req.body[i].realacumulado;
            delete req.body[i].planacumulado;
            updates.push(Object.values(req.body[i]));
        }
        console.log(updates);
        // const query = 'UPDATE energia SET fecha = \''+req.body.fecha+'\',plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
        await pool.query('INSERT INTO energia (id, plan, consumo, lectura) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan),consumo=VALUES(consumo),lectura=VALUES(lectura);', [updates] , function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Energy record updated'});
        });
        res.json({message: 'Energy record updated'});
    }

    public async updatePlans(req: Request, res: Response): Promise<void>{
        //console.log(req.body);
        let inicio = req.body.start.substr(0,req.body.start.indexOf('T'));
        const fin = req.body.end.substr(0,req.body.end.indexOf('T'));
        const plan = req.body.plan;
        let erecords = [];
        while (moment(inicio).isSameOrBefore(fin, 'day')) {
            erecords.push([inicio, Number(plan)]);
            inicio = moment(inicio).add(1,'days').format('YYYY-MM-DD');
        }
        //console.log(erecords);
        await pool.query('INSERT INTO energia (fecha, plan) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan);', [erecords] , function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Energy record updated'});
        });
        res.json({message: 'Energy record updated'});
    }

    public async deleteERecord(req: Request,res: Response) {
        const {id} = req.params;
        await pool.query('DELETE FROM energia WHERE id = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Energy record deleted"});
        });
    }
}

const energyController = new EnergyController();
export default energyController;