import { Router } from 'express';
import DeliverController from '../controllers/deliverController';

class DeliverRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/:code', DeliverController.getRemoteDeliver);
        this.router.post('/', DeliverController.saveDeliver);
    }
}
const deliverRoutes = new DeliverRoutes();
export default deliverRoutes.router;