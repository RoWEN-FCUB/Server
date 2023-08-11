import { Router } from 'express';
import visitorsController from '../controllers/visitorsController';

class VisitorsRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/records/:page&:id_serv', visitorsController.listAll);
        this.router.get('/one/:ci', visitorsController.listOne);
        this.router.post('/', visitorsController.create);
        this.router.delete('/:id', visitorsController.delete);
    }
}

const visitorsRoutes = new VisitorsRoutes();
export default visitorsRoutes.router;