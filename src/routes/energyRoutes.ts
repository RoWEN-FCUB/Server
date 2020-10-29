import { Router } from 'express';
import energyController  from '../controllers/energyController';

class EnergyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/:year&:month', energyController.list);
        this.router.get('/months/:year', energyController.listMonths);
        this.router.get('/reading/:date', energyController.getReading);
        this.router.post('/create', energyController.create);
        this.router.put('/update/:id', energyController.update);
        this.router.put('/updateAll', energyController.updateAll);
        this.router.put('/updatePlans', energyController.updatePlans);
        this.router.delete('/:id', energyController.deleteERecord);
    }
}
const energyRoutes = new EnergyRoutes();
export default energyRoutes.router;