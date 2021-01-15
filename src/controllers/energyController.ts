import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');

class EnergyController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const {month} = req.params;
        const {year} = req.params;
        const {id_emp} = req.params;
        const tasks = await pool.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND id_emp = ?;", [year, month, id_emp], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listMonths (req: Request, res: Response): Promise<void>{
        const {year} = req.params;
        const {id_emp} = req.params;      
        const tasks = await pool.query("SELECT MONTH(fecha) as Mes, sum(plan) as Plan, sum(consumo) as Consumo FROM energia WHERE YEAR(fecha) = ? AND id_emp = ? GROUP BY MONTH(fecha) ORDER BY mes;", [year, id_emp], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getReading (req: Request,res: Response): Promise<void>{
        const {date} = req.params;
        const {id_emp} = req.params;       
        const tasks = await pool.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? AND id_emp = ? ORDER BY lectura DESC LIMIT 1 ", [date, id_emp], function(error: any, results: any, fields: any){
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
        req.body.id_emp = Number(req.body.id_emp);
        const query = 'INSERT INTO energia (fecha, plan, consumo, lectura, id_emp) VALUES(\''+req.body.fecha+'\', '+req.body.plan+', '+req.body.consumo+', '+req.body.lectura+', '+req.body.id_emp+');';
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
        req.body.id_emp = Number(req.body.id_emp);
        const query = 'UPDATE energia SET plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+', plan_hpic = '+req.body.plan_hpic+', real_hpic = '+req.body.real_hpic+', id_emp = '+req.body.id_emp+' WHERE id = '+id+';';
        // console.log(query);
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
        // console.log(updates);
        // const query = 'UPDATE energia SET fecha = \''+req.body.fecha+'\',plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
        await pool.query('INSERT INTO energia (id, plan, consumo, lectura, plan_hpic, real_hpic, id_emp) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan),consumo=VALUES(consumo),lectura=VALUES(lectura),plan_hpic=VALUES(plan_hpic),real_hpic=VALUES(real_hpic);', [updates] , function(error: any, results: any, fields: any) {
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
        const plan_pico = req.body.plan_pico;
        const id_emp = req.body.id_emp;
        let erecords = [];
        while (moment(inicio).isSameOrBefore(fin, 'day')) {
            erecords.push([inicio, Number(plan), Number(plan_pico), Number(id_emp)]);
            inicio = moment(inicio).add(1,'days').format('YYYY-MM-DD');
        }
        //console.log(erecords);
        await pool.query('INSERT INTO energia (fecha, plan, plan_hpic, id_emp) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan), plan_hpic=VALUES(plan_hpic);', [erecords] , function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Energy record updated'});
        });
        res.json({message: 'Energy record updated'});
    }

    public async deleteERecord(req: Request,res: Response) {
        const {id} = req.params;
        await pool.query('UPDATE energia SET consumo = null, lectura = null, real_hpic = null WHERE id = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Energy record deleted"});
        });
    }
}

const energyController = new EnergyController();
export default energyController;