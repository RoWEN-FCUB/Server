import { Router } from 'express';
import energyController  from '../controllers/energyController';

class EnergyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/:year&:month', energyController.list);
        this.router.get('/reading/:date', energyController.getReading);
        this.router.post('/create', energyController.create);
        this.router.put('/update/:id', energyController.update);
        this.router.put('/updateAll', energyController.updateAll);
    }
}
const energyRoutes = new EnergyRoutes();
export default energyRoutes.router;