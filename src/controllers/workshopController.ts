import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');
import usersController from './usersController';

class WorkshopController {

    constructor() {}

    public async listAll (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente) ORDER BY id DESC;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listClients (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT * FROM taller_clientes ORDER BY siglas;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listDevices (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT * FROM taller_equipos;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listNames (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
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
        // console.log(notificacion);
        const notif = await pool.query('INSERT INTO notificaciones set ?',[notificacion], async function(error: any, results: any, fields: any){
            if (error) {
                console.log(error);
            }
            req.body.fecha_entrada = req.body.fecha_entrada.substring(0, req.body.fecha_entrada.indexOf('T'));
            // console.log(req.body);
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
        // console.log(req.body);
        const result = await pool.query('UPDATE taller_registro set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Record updated"});
        });   
    }

    public async search(req: Request, res: Response): Promise<void>{
        const {str} = req.params;        
        const keys = str.split(' ', 13);
        let query = '';
        // console.log(keys);
        if (keys.length >= 0) {
            query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
            if (keys.length >= 0) {
                query += ' WHERE ';
            }
            for (let i = 0; i < keys.length; i++) {
                if (i === 0) {
                    query += "(cliente LIKE '%" + keys[i] + "%'";
                } else {
                    query += "AND (cliente LIKE '%" + keys[i] + "%'";
                }                
                query += " OR equipo LIKE '%" + keys[i] + "%'";
                query += " OR marca LIKE '%" + keys[i] + "%'";
                query += " OR modelo LIKE'%" + keys[i] + "%'";
                query += " OR inventario LIKE '%" + keys[i] + "%'";
                query += " OR serie LIKE '%" + keys[i] + "%'";
                query += " OR fecha_entrada LIKE '%" + keys[i] + "%'";
                query += " OR entregado LIKE '%" + keys[i] + "%'";
                query += " OR ot LIKE '%" + keys[i] + "%'";
                query += " OR estado LIKE '%" + keys[i] + "%'";
                query += " OR especialista LIKE '%" + keys[i] + "%'";
                query += " OR fecha_salida LIKE '%" + keys[i] + "%'";
                query += " OR recogido LIKE '%" + keys[i] + "%'";
                query += " OR taller_clientes.nombre LIKE '%" + keys[i] + "%')";
            }            
            query += ' ORDER BY id DESC;';
        } else {
            query = 'SELECT taller_registro.*, taller_clientes.nombre as cliente_nombre FROM taller_registro INNER JOIN taller_clientes ON (taller_clientes.siglas = taller_registro.cliente)';
            query += ' ORDER BY id DESC;';
        }
        console.log(query);
        const records = await pool.query(query, function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }
}

const workshopController = new WorkshopController();
export default workshopController;