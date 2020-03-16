import { Router } from 'express';
import workshopController from '../controllers/workshopController';

class WorkshopRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', workshopController.listAll);
    }
}
const workshopRoutes = new WorkshopRoutes();
export default workshopRoutes.router;