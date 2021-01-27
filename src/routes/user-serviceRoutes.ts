import { Router } from 'express';
import userserviceController from '../controllers/user-serviceController';

class UserServiceRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/get/:id', userserviceController.getServices);
        this.router.delete('/:id', userserviceController.delete);
    }
}
const userserviceRoutes = new UserServiceRoutes();
export default userserviceRoutes.router;