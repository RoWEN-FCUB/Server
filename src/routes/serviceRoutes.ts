import { Router } from 'express';
import serviceController from '../controllers/serviceController';

class ServiceRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list', serviceController.list);
        this.router.get('/get/:id', serviceController.getOne);
        this.router.get('/user_services/:id', serviceController.userServices);
        this.router.post('/', serviceController.create);
        this.router.put('/:id', serviceController.update);
        this.router.delete('/:id', serviceController.delete);
    }
}
const serviceRoutes = new ServiceRoutes();
export default serviceRoutes.router;