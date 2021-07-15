import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');
import usersController from './usersController';

class WorkshopController {

    constructor() {}

    public async listAll (req: Request,res: Response): Promise<void>{
        const page = Number(req.params.page);
        const id_serv = Number(req.params.id_emp);
        const records = await pool.query("SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE id_emp = ? ORDER BY id DESC LIMIT 10 OFFSET ?;", [id_serv, ((page - 1) * 10)], async function(error: any, wrecords: any, fields: any){            
            const reccount = await pool.query("SELECT count(*) as total_records FROM taller_registro;", function(error: any, count: any, fields: any){            
                const total = count[0].total_records;                
                res.json({wrecords, total});
            });            
        });   
    }

    public async listParts (req: Request,res: Response): Promise<void>{        
        const id_reg = Number(req.params.id_reg);
        const records = await pool.query("SELECT * FROM taller_registro_partes WHERE id_reg = ?;", [id_reg], function(error: any, results: any, fields: any){            
            // console.log('Probando' + results)
            res.json(results);            
        });   
    }

    public async listAllParts (req: Request,res: Response): Promise<void>{
        const records = await pool.query("SELECT DISTINCT(parte) FROM taller_registro_partes;", function(error: any, results: any, fields: any){            
            // console.log('Probando' + results)
            res.json(results);            
        });
    }

    public async listPartMarcs (req: Request,res: Response): Promise<void>{
        const part = req.params.part;
        const records = await pool.query("SELECT DISTINCT(marca) FROM taller_registro_partes WHERE parte = ?;", [part], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listPartModels (req: Request,res: Response): Promise<void>{
        const part = req.params.part;
        const marc = req.params.marc;
        const records = await pool.query("SELECT DISTINCT(modelo) FROM taller_registro_partes WHERE parte = ? AND marca = ?;", [part, marc], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listPartCaps (req: Request,res: Response): Promise<void>{
        const part = req.params.part;
        const records = await pool.query("SELECT DISTINCT(capacidad) FROM taller_registro_partes WHERE parte = ?;", [part], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async listClients (req: Request,res: Response): Promise<void>{        
        const records = await pool.query("SELECT * FROM taller_clientes ORDER BY siglas;", function(error: any, results: any, fields: any){            
            // console.log('Probando' + results)
            res.json(results);            
        });   
    }

    public async listDevices (req: Request,res: Response): Promise<void>{        
        const records = await pool.query("SELECT DISTINCT(equipo) FROM taller_equipos;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listMarcs (req: Request,res: Response): Promise<void>{  
        const equipo = req.params.equipo;
        const records = await pool.query("SELECT DISTINCT(marca) FROM taller_equipos WHERE equipo = ?;", equipo, function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listModels (req: Request,res: Response): Promise<void>{  
        const equipo = req.params.equipo;
        const marca = req.params.marca;
        const records = await pool.query("SELECT DISTINCT(modelo) FROM taller_equipos WHERE equipo = ? AND marca = ?;", [equipo, marca], function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listSerialsInv (req: Request,res: Response): Promise<void>{  
        const equipo = req.params.equipo;
        const marca = req.params.marca;
        const modelo = req.params.modelo;
        const records = await pool.query("SELECT serie, inventario FROM taller_equipos WHERE equipo = ? AND marca = ? AND modelo = ?;", [equipo, marca, modelo], function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listNames (req: Request,res: Response): Promise<void>{    
        const id_cliente = req.params.id_cliente;    
        const records = await pool.query("SELECT * FROM taller_clientes_personas WHERE id_cliente = ?;", [id_cliente], function(error: any, results: any, fields: any){
            res.json(results);
        });
    }

    public async listPerson (req: Request,res: Response): Promise<void>{    
        const ci = req.params.ci;    
        const records = await pool.query("SELECT * FROM taller_clientes_personas WHERE ci = ?;", [ci], function(error: any, results: any, fields: any){
            res.json(results[0]);            
        });   
    }

    public async createWPerson(req: Request, res: Response): Promise<void>{
        const siglas = req.params.siglas;
        //console.log(req.body);
        pool.query('SELECT id FROM taller_clientes WHERE siglas =  ?', siglas, function(error: any, id: any, fields: any) {
            if (error) {
                console.log(error);
            }
            // console.log(id);
            req.body.id_cliente = id[0].id;
            delete req.body.id;
            pool.query('INSERT INTO taller_clientes_personas set ?', req.body, function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
                res.json({message: 'Person created'});
            });
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        if (req.body.cliente_nombre !== '') {
            const new_client = {siglas: req.body.cliente, nombre: req.body.cliente_nombre};
            pool.query('INSERT INTO taller_clientes set ?', new_client, function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
            });
        }
        delete req.body.cliente_nombre;
        const id_superior = req.body.id_superior;
        delete req.body.id_superior;
        delete req.body.entrega_ci;
        delete req.body.recoge_ci;
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
        const notif = await pool.query('INSERT INTO notificaciones set ?',[notificacion], async function(error: any, results1: any, fields: any){
            if (error) {
                console.log(error);
            }
            req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));            
            await pool.query('INSERT INTO taller_registro set ?',[req.body], function(error: any, _results2: any, fields: any) {
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
        delete req.body.entrega_ci;
        req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
        req.body.fecha_salida = req.body.fecha_salida.substring(0, req.body.fecha_salida.indexOf('T'));
        delete req.body.cliente_nombre;
        delete req.body.recoge_ci;
        // console.log(req.body);
        const result = await pool.query('UPDATE taller_registro set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Record updated"});
        });
    }

    public async search(req: Request, res: Response): Promise<void>{
        const str = String(req.params.str);
        const page = Number(req.params.page);
        const id_serv = Number(req.params.id_serv);
        const keys = str.split(' ', 13);
        let query = '';
        let query_count = 'SELECT count(*) as total_records FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
        let query_mod = '';
        if (keys.length >= 0 && str !== 'null') {
            query = 'SELECT taller_registro.id, taller_registro.cod, taller_registro.cliente, taller_registro.equipo, taller_registro.marca, taller_registro.modelo, taller_registro.inventario, taller_registro.serie, taller_registro.fecha_entrada, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.entregado) AS entregado, taller_registro.entregado AS entrega_ci, taller_registro.ot, taller_registro.estado, taller_registro.especialista, taller_registro.fecha_salida, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.recogido) AS recogido, taller_registro.recogido AS recoge_ci, taller_registro.id_serv, taller_registro.fallo, taller_registro.observaciones, taller_registro.externo, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) WHERE ';            
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
            query_count += ' WHERE ' + query_mod + ' AND id_serv = ' + id_serv + ';';
            query += query_mod + ' AND id_serv = ' + id_serv + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
        } else {
            query = 'SELECT taller_registro.id, taller_registro.cod, taller_registro.cliente, taller_registro.equipo, taller_registro.marca, taller_registro.modelo, taller_registro.inventario, taller_registro.serie, taller_registro.fecha_entrada, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.entregado) AS entregado, taller_registro.entregado AS entrega_ci, taller_registro.ot, taller_registro.estado, taller_registro.especialista, taller_registro.fecha_salida, (SELECT nombre FROM taller_clientes_personas WHERE ci = taller_registro.recogido) AS recogido, taller_registro.recogido AS recoge_ci, taller_registro.id_serv, taller_registro.fallo, taller_registro.observaciones, taller_registro.externo, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
            query += ' WHERE id_serv = ' + id_serv + ' ORDER BY id DESC LIMIT 10 OFFSET ' + ((page - 1) * 10) + ';';
            query_count += ' WHERE id_serv = ' + id_serv + ';';
        } 
        // console.log(query);
        const records = await pool.query(query, async function(error: any, wrecords: any, fields: any){
            const reccount = await pool.query(query_count, function(error: any, count: any, fields: any){            
                let total = 0;
                if(count[0].total_records) {
                    total = count[0].total_records;
                }   
                // console.log(wrecords);
                res.json({wrecords, total});
            });
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const reccount = await pool.query('DELETE FROM taller_registro WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"WRecord deleted"});
        });
    }

    public async deletePart(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const reccount = await pool.query('DELETE FROM taller_registro_partes WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"WPart deleted"});
        });
    }

    public async deleteWDevice(req: Request, res: Response): Promise<void>{
        const {wdev} = req.params;
        const reccount = await pool.query('DELETE FROM taller_equipos WHERE equipo = ?', [wdev], function(error: any, results: any, fields: any){            
            res.json({text:"WDevice deleted"});
        });
    }

    public async deleteWPerson(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const reccount = await pool.query('DELETE FROM taller_clientes_personas WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"WPerson deleted"});
        });
    }

    public async deleteWCLient(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const reccount = await pool.query('DELETE FROM taller_clientes_personas WHERE id_cliente = ?', [id], async function(error: any, results: any, fields: any){            
            const reccount = await pool.query('DELETE FROM taller_clientes WHERE id = ?', [id], function(error: any, results: any, fields: any){            
                res.json({text:"WClient deleted"});
            });
        });
    }

    public async updateParts(req: Request, res: Response): Promise<void>{
        // console.log(req.body);
        let updates = [];
        for (let i = 0; i < req.body.length; i++) {
            updates.push(Object.values(req.body[i]));
        }
        if (updates.length > 0) {
            await pool.query('INSERT INTO taller_registro_partes VALUES ? ON DUPLICATE KEY UPDATE parte = VALUES(parte), marca = VALUES(marca), modelo = VALUES(modelo), capacidad = VALUES(capacidad), cantidad = VALUES(cantidad), serie = VALUES(serie), id_reg = VALUES(id_reg);', [updates] , function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
                res.json({message: 'Workshop parts updated'});
            });
        }
        res.json({message: 'Workshop parts updated'});
    }
}

const workshopController = new WorkshopController();
export default workshopController;