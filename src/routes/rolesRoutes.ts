import { Router } from 'express';
import usersController from '../controllers/usersController';

class RolesRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', usersController.getRoles);            
    }
}
const rolesRoutes = new RolesRoutes();
export default rolesRoutes.router;