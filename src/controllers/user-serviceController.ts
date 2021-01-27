import { Request, Response } from 'express';
import pool from '../database';

class UserServiceController {
    constructor() {}

    public async getServices (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const tasks = await pool.query("SELECT * FROM usuario_servicio WHERE id_usuario = ?;", [id], function(error: any, results: any, fields: any){
            res.json(results[0]);
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const company = await pool.query('DELETE FROM usuario_servicio WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"Service deleted"});
        });        
    }
}
const userserviceController = new UserServiceController();
export default userserviceController;