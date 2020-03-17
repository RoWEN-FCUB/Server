import { Request, Response } from 'express';
import pool from '../database';
var moment = require('moment');
import usersController from './usersController';

class WorkshopController {

    constructor() {}

    public async listAll (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT * FROM taller_registro ORDER BY id DESC;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listClients (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT * FROM taller_clientes;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }

    public async listDevices (req: Request,res: Response): Promise<void>{
        //const {id} = req.params;
        const records = await pool.query("SELECT * FROM taller_equipos;", function(error: any, results: any, fields: any){
            res.json(results);            
        });   
    }
}

const workshopController = new WorkshopController();
export default workshopController;