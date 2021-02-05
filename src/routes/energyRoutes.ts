import { Router } from 'express';
import energyController  from '../controllers/energyController';

class EnergyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/:year&:month&:id_serv', energyController.list);
        this.router.get('/allservices/:year&:month&:id_user', energyController.allservices);
        this.router.get('/months/:year&:id_serv', energyController.listMonths);
        this.router.get('/monthsallservices/:year&:id_user', energyController.listMonthsAllServices);
        this.router.get('/reading/:date&:id_serv', energyController.getReading);
        this.router.get('/readingbyservices/:id&:fecha', energyController.getReadingsByService);
        this.router.get('/unbloquedservices/:id_user&:date', energyController.unbloquedservices);
        this.router.post('/create', energyController.create);
        this.router.put('/update/:id', energyController.update);
        this.router.delete('/block/:id', energyController.blockRecord);
        this.router.delete('/unblock/:id', energyController.unblockRecord);
        this.router.delete('/blockall/:id_user&:date', energyController.blockAllRecords);
        this.router.delete('/unblockall/:id_user&:date', energyController.unblockAllRecords);
        this.router.put('/updateAll', energyController.updateAll);
        this.router.put('/updatePlans', energyController.updatePlans);
        this.router.delete('/:id', energyController.deleteERecord);
    }
}
const energyRoutes = new EnergyRoutes();
export default energyRoutes.router;