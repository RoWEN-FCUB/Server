import { Router } from 'express';
import energyController  from '../controllers/energyController';

class EnergyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/:year&:month', energyController.list);
        this.router.get('/reading/:date', energyController.getReading);
        this.router.post('/', energyController.create);
    }
}
const energyRoutes = new EnergyRoutes();
export default energyRoutes.router;