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
    }

    public async update (req: Request,res: Response): Promise<void>{
        const {id} = req.params;
        const result = await pool.query('UPDATE taller_registro set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Record updated"});
        });   
    }
}

const workshopController = new WorkshopController();
export default workshopController;