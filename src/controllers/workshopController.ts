import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');
import usersController from './usersController';

class WorkshopController {

    constructor() {}

    public async listAll (req: Request,res: Response): Promise<void>{
        const page = Number(req.params.page);
        const id_emp = Number(req.params.id_emp);
        const records = await pool.query("SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE id_emp = ? ORDER BY id DESC LIMIT 10 OFFSET ?;", [id_emp, ((page - 1) * 10)], async function(error: any, wrecords: any, fields: any){            
            const reccount = await pool.query("SELECT count(*) as total_records FROM taller_registro;", function(error: any, count: any, fields: any){            
                const total = count[0].total_records;                
                res.json({wrecords, total});
            });            
        });   
    }

    public async listClients (req: Request,res: Response): Promise<void>{        
        const records = await pool.query("SELECT * FROM taller_clientes ORDER BY siglas;", function(error: any, results: any, fields: any){            
            // console.log('Probando' + results)
            res.json(results);            
        });   
    }

    public async listDevices (req: Request,res: Response): Promise<void>{        
        const records = await pool.query("SELECT * FROM taller_equipos;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listNames (req: Request,res: Response): Promise<void>{        
        const records = await pool.query("SELECT * FROM taller_clientes_personas;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async create(req: Request, res: Response): Promise<void>{
        if (req.body.cliente_nombre !== '') {
            const new_client = {siglas: req.body.cliente, nombre: req.body.cliente_nombre};
            pool.query('INSERT INTO taller_clientes set ?', new_client, function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
            })
        }
        delete req.body.cliente_nombre;
        const id_superior = req.body.id_superior;
        delete req.body.id_superior;
        const date = new Date();
        const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        const offset = date.getTimezoneOffset() / 60;
        const hours = date.getHours();
        newDate.setHours(hours - offset);
        let notificacion = {
            id_usuario: id_superior,
            notificacion: '<b>' + req.body.especialista + '</b> le ha dado entrada al equipo: <b>' + req.body.equipo + ' ' + req.body.marca + '</b>.',
            fecha: newDate.toISOString(),
            leida: false,
            vinculo: '/workshop',
            estatus: 'info',
        };
        notificacion.fecha = notificacion.fecha.substring(0, notificacion.fecha.indexOf('T'));        
        const notif = await pool.query('INSERT INTO notificaciones set ?',[notificacion], async function(error: any, results: any, fields: any){
            if (error) {
                console.log(error);
            }
            req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));            
            await pool.query('INSERT INTO taller_registro set ?',[req.body], function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
                else {
                    res.json({message: 'Registro salvado'});
                }            
            });      
        });        
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;        
        req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
        req.body.fecha_salida = req.body.fecha_salida.substring(0, req.body.fecha_salida.indexOf('T'));
        delete req.body.cliente_nombre;        
        const result = await pool.query('UPDATE taller_registro set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Record updated"});
        });   
    }

    public async search(req: Request, res: Response): Promise<void>{
        const str = String(req.params.str);
        const page = Number(req.params.page);
        const id_emp = Number(req.params.id_emp);
        const keys = str.split(' ', 13);
        let query = '';
        let query_count = 'SELECT count(*) as total_records FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
        let query_mod = '';
        if (keys.length >= 0 && str !== 'null') {
            query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE ';            
            for (let i = 0; i < keys.length; i++) {
                if (i === 0) {
                    query_mod += "(cliente LIKE '%" + keys[i] + "%'";
                } else {
                    query_mod += "AND (cliente LIKE '%" + keys[i] + "%'";
                }                
                query_mod += " OR equipo LIKE '%" + keys[i] + "%'";
                query_mod += " OR marca LIKE '%" + keys[i] + "%'";
                query_mod += " OR modelo LIKE'%" + keys[i] + "%'";
                query_mod += " OR inventario LIKE '%" + keys[i] + "%'";
                query_mod += " OR serie LIKE '%" + keys[i] + "%'";
                query_mod += " OR fecha_entrada LIKE '%" + keys[i] + "%'";
                query_mod += " OR entregado LIKE '%" + keys[i] + "%'";
                query_mod += " OR ot LIKE '%" + keys[i] + "%'";
                query_mod += " OR estado LIKE '%" + keys[i] + "%'";
                query_mod += " OR especialista LIKE '%" + keys[i] + "%'";
                query_mod += " OR fecha_salida LIKE '%" + keys[i] + "%'";
                query_mod += " OR recogido LIKE '%" + keys[i] + "%'";
                query_mod += " OR taller_clientes.nombre LIKE '%" + keys[i] + "%')";
            }
            query_count += ' WHERE ' + query_mod + ' AND id_emp = ' + id_emp + ';';
            query += query_mod + ' AND id_emp = ' + id_emp + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
        } else {
            query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
            query += ' WHERE id_emp = ' + id_emp + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
            query_count += ' WHERE id_emp = ' + id_emp + ';';
        }        
        // console.log(query_count);
        const records = await pool.query(query, async function(error: any, wrecords: any, fields: any){
            const reccount = await pool.query(query_count, function(error: any, count: any, fields: any){            
                let total = 0;
                if(count[0].total_records) {
                    total = count[0].total_records;
                }                                
                res.json({wrecords, total});
            });
        });
    }
}

const workshopController = new WorkshopController();
export default workshopController;