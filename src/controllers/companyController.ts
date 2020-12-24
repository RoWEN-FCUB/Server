import { Request, Response } from 'express';
import pool from '../database';

class CompanyController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const tasks = await pool.query("SELECT * FROM empresas;", function(error: any, results: any, fields: any){
            res.json(results);            
        });
    }
}
const companyController = new CompanyController();
export default companyController;