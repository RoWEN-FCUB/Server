import { Router } from 'express';
import workshopController from '../controllers/workshopController';

class WorkshopRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', workshopController.listAll);
        this.router.get('/clients', workshopController.listClients);
        this.router.get('/devices', workshopController.listDevices);
        this.router.get('/names', workshopController.listNames);
        this.router.post('/', workshopController.create);
        this.router.put('/:id', workshopController.update);
    }
}
const workshopRoutes = new WorkshopRoutes();
export default workshopRoutes.router;