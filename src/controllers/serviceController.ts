import { Request, Response } from 'express';
import pool from '../database';
var fetch = require('node-fetch');

class ServiceController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const {id_emp} = req.params;
        const tasks = await pool.query("SELECT servicios.*, empresas.siglas AS nombre_emp FROM servicios LEFT JOIN empresas ON (empresas.id = servicios.id_emp) WHERE servicios.id_emp = ? ORDER BY servicios.id;", [id_emp], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getUserServices (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT servicios.* FROM servicios INNER JOIN usuario_servicio ON (servicios.id = usuario_servicio.id_servicio) WHERE usuario_servicio.id_usuario = ? ORDER BY servicios.id;", [id], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async updateUserServices (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query("DELETE FROM usuario_servicio WHERE id_usuario = ?", [id], async function(error: any, results: any, fields: any){
            if (req.body.length > 0) {
                await pool.query("INSERT INTO usuario_servicio (id_usuario, id_servicio) VALUES ?", [req.body], function(error: any, results: any, fields: any){
                    res.json({message: 'Service saved'});
                });
            } else {
                res.json({message: 'Service saved'});
            }
        });
    }

    public async getOne (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT * FROM servicios WHERE id = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results[0]);
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        await pool.query('INSERT INTO servicios SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Service saved'});
        });
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const result = pool.query('UPDATE servicios set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Service updated"});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const company = await pool.query('DELETE FROM servicios WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Service deleted"});
        });        
    }

    public async getGeolocation (req: Request, res: Response): Promise<void>{
        const city = req.params.city;
        let options = {json: true};
        const url = 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=Cuba';
        try {
            const response = await fetch(url, {
              method: 'get',
              headers:{'X-Api-Key': 'SA6Mqw5WV97WzR29uc1kEQ==iQbcaSOYZk5FR4uq'}
            });
            const cities = await response.json();
            if (cities.length > 0) {
              res.json(cities);
            }
          } catch (error) {
            console.log(error);
            res.status(404).json({text: 'Error al contactar con el servidor api'});
          }
    }

    public async getServiceDepartments (req: Request, res: Response): Promise<void>{
        const {id_serv} = req.params;
        const tasks = await pool.query("SELECT * FROM departamentos WHERE id_serv = ?", [id_serv], function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async createDepartment(req: Request, res: Response): Promise<void>{
        await pool.query('INSERT INTO departamentos SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'Department saved'});
        });
    }

    public async deleteDepartment(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const company = await pool.query('DELETE FROM departamentos WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Department deleted"});
        });        
    }
}
const serviceController = new ServiceController();
export default serviceController;