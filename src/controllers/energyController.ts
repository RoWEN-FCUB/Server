import { Request, Response } from 'express';
import { body } from 'express-validator';
import pool from '../database';
var moment = require('moment');

class EnergyController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const {month} = req.params;
        const {year} = req.params;
        const {id_serv} = req.params;
        const tasks = await pool.query("SELECT * FROM energia WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND id_serv = ?;", [year, month, id_serv], function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async listMonths (req: Request, res: Response): Promise<void>{
        const {year} = req.params;
        const {id_serv} = req.params;      
        const tasks = await pool.query("SELECT MONTH(fecha) as Mes, sum(plan) as Plan, sum(consumo) as Consumo FROM energia WHERE YEAR(fecha) = ? AND id_serv = ? GROUP BY MONTH(fecha) ORDER BY mes;", [year, id_serv], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getReading (req: Request,res: Response): Promise<void>{
        const {date} = req.params;
        const {id_serv} = req.params;       
        const tasks = await pool.query("SELECT lectura FROM energia WHERE DATE(fecha) < ? AND id_serv = ? ORDER BY lectura DESC LIMIT 1 ", [date, id_serv], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        delete req.body.planacumulado;
        delete req.body.realacumulado;
        req.body.fecha = req.body.fecha.substr(0,req.body.fecha.indexOf('T'));
        req.body.plan = Number(req.body.plan);
        req.body.plan_hpicd = Number(req.body.plan_hpicd);
        req.body.plan_hpicn = Number(req.body.plan_hpicn);
        req.body.lectura = Number(req.body.lectura);
        req.body.lectura_hpicd1 = Number(req.body.lectura_hpicd1);
        req.body.lectura_hpicd2 = Number(req.body.lectura_hpicd2);
        req.body.lectura_hpicn1 = Number(req.body.lectura_hpicn1);
        req.body.lectura_hpicn2 = Number(req.body.lectura_hpicn2);
        req.body.id_serv = Number(req.body.id_serv);
        let query = 'INSERT INTO energia (fecha, plan, consumo, lectura, lectura_hpicd1, lectura_hpicd2, lectura_hpicn1, lectura_hpicn2, plan_hpicd, plan_hpicn, id_serv) ';
        query += 'VALUES(\''+req.body.fecha+'\', '+req.body.plan+', '+req.body.consumo+', '+req.body.lectura+', '+req.body.lectura_hpicd1+', '+req.body.lectura_hpicd2+', '+req.body.lectura_hpicn1+', '+req.body.lectura_hpicn2+', '+req.body.plan_hpicd+', '+req.body.plan_hpicn+', '+req.body.id_serv+');'
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
        req.body.plan_hpicd = Number(req.body.plan_hpicd);
        req.body.plan_hpicn = Number(req.body.plan_hpicn);
        req.body.lectura = Number(req.body.lectura);
        req.body.lectura_hpicd1 = Number(req.body.lectura_hpicd1);
        req.body.lectura_hpicd2 = Number(req.body.lectura_hpicd2);
        req.body.lectura_hpicn1 = Number(req.body.lectura_hpicn1);
        req.body.lectura_hpicn2 = Number(req.body.lectura_hpicn2);
        req.body.id_serv = Number(req.body.id_serv);
        const query = 'UPDATE energia SET plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+', lectura_hpicd1 = '+req.body.lectura_hpicd1+', lectura_hpicd2 = '+req.body.lectura_hpicd2+', lectura_hpicn1 = '+req.body.lectura_hpicn2+', lectura_hpicd1 = '+req.body.lectura_hpicn2+', plan_hpicd = '+req.body.plan_hpicd+', plan_hpicn = '+req.body.plan_hpicn+', id_serv = '+req.body.id_serv+' WHERE id = '+id+';';
        // console.log(query);
        await pool.query(query, function(error: any, results: any, fields: any) {
            res.json({message: 'Energy record updated'});
        });
    }

    public async updateAll(req: Request, res: Response): Promise<void>{
        let updates = [];
        for (let i = 0; i < req.body.length; i++) {
            delete req.body[i].realacumulado;
            delete req.body[i].planacumulado;
            updates.push(Object.values(req.body[i]));
        }
        // console.log(updates);
        // const query = 'UPDATE energia SET fecha = \''+req.body.fecha+'\',plan = '+req.body.plan+', consumo = '+req.body.consumo+', lectura = '+req.body.lectura+' WHERE id = '+id+';';
        await pool.query('INSERT INTO energia (id, plan, consumo, lectura, lectura_hpicd1, lectura_hpicd2, lectura_hpicn1, lectura_hpicn2, plan_hpicd, plan_hpicn, id_serv) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan),consumo=VALUES(consumo),lectura=VALUES(lectura),lectura_hpicd1=VALUES(lectura_hpicd1),lectura_hpicd2=VALUES(lectura_hpicd2),lectura_hpicn1=VALUES(lectura_hpicn1),lectura_hpicn2=VALUES(lectura_hpicn2),plan_hpicd=VALUES(plan_hpicd),plan_hpicn=VALUES(plan_hpicn);', [updates] , function(error: any, results: any, fields: any) {
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
        const plan_picod = req.body.plan_picod;
        const plan_picon = req.body.plan_picon;
        const id_serv = req.body.id_serv;
        let erecords = [];
        while (moment(inicio).isSameOrBefore(fin, 'day')) {
            erecords.push([inicio, Number(plan), Number(plan_picod), Number(plan_picon), Number(id_serv)]);
            inicio = moment(inicio).add(1,'days').format('YYYY-MM-DD');
        }
        //console.log(erecords);
        await pool.query('INSERT INTO energia (fecha, plan, plan_hpicd, plan_hpicn, id_serv) VALUES ? ON DUPLICATE KEY UPDATE plan=VALUES(plan), plan_hpicd=VALUES(plan_hpicd), plan_hpicn=VALUES(plan_hpicn);', [erecords] , function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Energy record updated'});
        });
        res.json({message: 'Energy record updated'});
    }

    public async deleteERecord(req: Request,res: Response) {
        const {id} = req.params;
        await pool.query('UPDATE energia SET consumo = null, lectura = null, lectura_hpicd1 = null, lectura_hpicd2 = null, lectura_hpicn1 = null, lectura_hpicn2 = null WHERE id = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Energy record deleted"});
        });
    }
}

const energyController = new EnergyController();
export default energyController;