import { Router } from 'express';
import geeController from '../controllers/geeController';


class GEERoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/', geeController.list);
        this.router.get('/listGEEByUser/:id', geeController.listGEEByUser);
        this.router.get('/listGEERecords/:id', geeController.listRecords);
        this.router.post('/', geeController.create);
        this.router.delete('/:id', geeController.delete);
    }
}
const geeRoutes = new GEERoutes();
export default geeRoutes.router;