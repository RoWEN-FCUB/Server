import { Router } from 'express';
import geeController from '../controllers/geeController';


class GEERoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/', geeController.list);
        this.router.get('/fuelPrices/', geeController.getFuelPrices);
        this.router.get('/listGEEByUser/:id', geeController.listGEEByUser);
        this.router.get('/listGEERecords/:id', geeController.listRecords);
        this.router.get('/listCardsByGEE/:id_gee', geeController.listCardsbyGEE);
        this.router.get('/listTanksByGEE/:id_gee', geeController.listTanksbyGEE);
        this.router.get('/getTotalExistence/:id_gee', geeController.getFuelExistenceByGee);
        this.router.get('/listCardsRecords/:id_card', geeController.listCardsRecords);
        this.router.post('/', geeController.create);
        this.router.post('/FCard', geeController.createFCard);
        this.router.post('/FCardRecord', geeController.createCardRecord);
        this.router.post('/changeFuelPrice', geeController.changeFuelPrice);
        this.router.put('/:id', geeController.update);
        this.router.delete('/:id', geeController.delete);
        this.router.delete('/deleteCardRecord/:id', geeController.deleteCardRecord);
        this.router.delete('/deleteFuelCard/:id', geeController.deleteFuelCard);
    }
}
const geeRoutes = new GEERoutes();
export default geeRoutes.router;