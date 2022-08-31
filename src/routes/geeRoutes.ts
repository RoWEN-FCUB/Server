import { Router } from 'express';
import geeController from '../controllers/geeController';


class GEERoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/', geeController.list);
    }
}
const geeRoutes = new GEERoutes();
export default geeRoutes.router;