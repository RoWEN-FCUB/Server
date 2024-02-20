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
        });
    }

    public async listNames (req: Request,res: Response): Promise<void>{
        const id_serv = Number(req.params.id_serv);
        await pool.query("SELECT DISTINCT nombre, organismo, ci, departamento FROM visitantes WHERE id_servicio = ?;", [id_serv], function(error: any, results: any, fields: any){                        
            if (error) {console.log(error);}
            res.json(results);
        });
    }

    public async filterVisitors (req: Request,res: Response): Promise<void>{
        const id_serv = Number(req.params.id_serv);
        const page = Number(req.params.page);
        let query = "SELECT visitantes.*, users.user as nombre_autoriza FROM visitantes INNER JOIN users ON (visitantes.autoriza = users.id) WHERE id_servicio = ?";
        let params = '';
        if (req.body.nombre) {
            params += " AND visitantes.nombre LIKE '%" + req.body.nombre + "%'";
        }
        if (req.body.ci) {
            params += " AND visitantes.ci LIKE '%" + req.body.ci + "%'";
        }
        if (req.body.organismo) {
            params += " AND visitantes.organismo = '" + req.body.organismo + "'";
        }
        if (req.body.departamento) {
            params += " AND visitantes.departamento LIKE '%" + req.body.departamento + "%'";
        }
        if (req.body.fecha) {
            params += " AND visitantes.DATE(fecha) = " + "'" + moment(req.body.fecha).format('YYYY-MM-DD') + "'";
        }
        if (req.body.hora_entrada) {
            req.body.hora_entrada = moment(req.body.hora_entrada).format('HH:mm');
            params += " AND visitantes.hora_entrada LIKE '%" + req.body.hora_entrada + "%'";
        }
        if (req.body.hora_salida) {
            req.body.hora_salida = moment(req.body.hora_salida).format('HH:mm');
            params += " AND visitantes.hora_salida LIKE '%" + req.body.hora_salida + "%'";
        }
        query += params + " ORDER BY id DESC LIMIT 10 OFFSET ?;"
        console.log(query)
        await pool.query(query, [id_serv, ((page - 1) * 10)], async function(error: any, vrecords: any, fields: any){            
            await pool.query("SELECT count(*) as total_records FROM visitantes WHERE id_servicio = ?" + params + ";", [id_serv], function(error: any, count: any, fields: any){            
                const total = count[0].total_records;
                res.json({vrecords, total});
            });
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD');
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

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        req.body.hora_salida = moment(req.body.hora_salida).format('HH:mm');
        req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD');
        delete req.body.id;
        delete req.body.nombre_autoriza;
        const result = pool.query('UPDATE visitantes set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            if (error) {
                console.log(error);
            }
            res.json({text:"Visitor updated"});
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