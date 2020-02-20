import { Request, Response } from 'express';
import pool from '../database';

class AvatarController {

    public async create(req: any, res: any): Promise<void>{
        const filename = req.files.uploads.path.split('\\').pop().split('/').pop();
        res.json({fname: filename});
    }
    
}
const avatarController = new AvatarController();
export default avatarController;