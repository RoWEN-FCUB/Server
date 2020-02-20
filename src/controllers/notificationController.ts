import { Request, Response } from 'express';
import pool from '../database';

class NotificationController {
    public async getAllNotifications (req: Request,res: Response): Promise<void>{        
        const {id} = req.params; // id del usuario
        const notif = await pool.query('SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY id DESC', [id], function(error: any, results: any, fields: any){
            res.json(results);           
        });
    }

    public async getNewNotifications (req: Request,res: Response){        
        const {id} = req.params; // id del usuario        
        const notif = await pool.query('SELECT * FROM notificaciones WHERE id_usuario = ? AND leida = false ORDER BY id DESC', [id], function(error: any, results: any, fields: any){          
            res.json(results);
        });
    }

    public async notificationReaded (req: Request,res: Response) {
        const {id} = req.params;
        //console.log(id);
        const notif = await pool.query('UPDATE notificaciones SET leida = true WHERE id = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Notification readed"});
        });
    }

    public async notificationsReaded (req: Request,res: Response) {
        const {id} = req.params;
        const {notifid} = req.params;  
        const notif = await pool.query('UPDATE notificaciones SET leida = true WHERE id_usuario = ? AND id <= ?', [id, notifid], function(error: any, results: any, fields: any){          
            res.json({text:"Notification readed"});
        });
    }

    public async deleteNotification (req: Request,res: Response) {
        const {id} = req.params;
        await pool.query('DELETE FROM notificaciones WHERE id = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Notification deleted"});
        });
    }

    public async deleteAllNotifications (req: Request,res: Response) {
        const {id} = req.params;
        await pool.query('DELETE FROM notificaciones WHERE id_usuario = ?', [id], function(error: any, results: any, fields: any){          
            res.json({text:"Notifications deleted"});
        });
    }
}
const notificationController = new NotificationController();
export default notificationController;