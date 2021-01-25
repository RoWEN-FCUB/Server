import { Request, Response } from 'express';
import pool from '../database';

class CompanyController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const tasks = await pool.query("SELECT * FROM empresas;", function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }

    public async getOne (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT * FROM empresas WHERE id = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results[0]);
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        await pool.query('INSERT INTO empresas SET ?', [req.body], function(error: any, results: any, fields: any) {
            res.json({message: 'Company saved'});
        });
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        console.log(req.body);
        const result = pool.query('UPDATE empresas set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            res.json({text:"Company updated"});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const company = await pool.query('DELETE FROM empresas WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Company deleted"});
        });        
    }
}
const companyController = new CompanyController();
export default companyController;