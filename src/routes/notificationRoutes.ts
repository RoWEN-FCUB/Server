import { Router } from 'express';
import notificationController  from '../controllers/notificationController';

class NotificationsRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/:id', notificationController.getAllNotifications);
        this.router.delete('/:id', notificationController.deleteNotification);
        this.router.delete('/all/:id', notificationController.deleteAllNotifications);
        this.router.get('/news/:id', notificationController.getNewNotifications);
        this.router.put('/readed/:id', notificationController.notificationReaded);
        this.router.put('/allreaded/:id&:notifid', notificationController.notificationsReaded);
    }
}

const notificationsRoutes = new NotificationsRoutes();
export default notificationsRoutes.router;