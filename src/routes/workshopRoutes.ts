import { Router } from 'express';
import workshopController from '../controllers/workshopController';

class WorkshopRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/records/:page&:id_emp', workshopController.listAll);
        this.router.get('/clients', workshopController.listClients);
        this.router.get('/devices', workshopController.listDevices);
        this.router.get('/names', workshopController.listNames);
        this.router.post('/', workshopController.create);
        this.router.get('/search/:str&:page&:id_emp', workshopController.search);
        this.router.put('/:id', workshopController.update);
    }
}
const workshopRoutes = new WorkshopRoutes();
export default workshopRoutes.router;