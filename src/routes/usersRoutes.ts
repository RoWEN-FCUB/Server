import { Router } from 'express';
import usersController from '../controllers/usersController';

class UsersRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', usersController.list);
        this.router.get('/:id', usersController.getOne);
        this.router.get('/sub/:id', usersController.getSubordinados);
        this.router.get('/sup/:id', usersController.getSuperior);
        this.router.post('/', usersController.create);
        this.router.put('/:id', usersController.update);
        this.router.delete('/:id', usersController.delete);
        this.router.post('/login', usersController.validate);
        this.router.post('/refresh', usersController.refresh);
        this.router.post('/valid', usersController.user_valid);        
    }
}
const usersRoutes = new UsersRoutes();
export default usersRoutes.router;