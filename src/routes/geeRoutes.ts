import { Router } from 'express';
import geeController from '../controllers/geeController';


class GEERoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list/', geeController.list);
        this.router.get('/fuelTypes/', geeController.getFuelTypes);
        this.router.get('/listGEEByUser/:id', geeController.listGEEByUser);
        this.router.get('/listGEERecords/:id&:page&:limit', geeController.listRecords);
        this.router.get('/listCardsByGEE/:id_gee', geeController.listCardsbyGEE);
        this.router.get('/listTanksByGEE/:id_gee&:page&:limit', geeController.listTanksbyGEE);
        //this.router.get('/getTotalExistence/:id_gee', geeController.getFuelExistenceByGee);
        this.router.get('/listCardsRecords/:id_card&:page&:limit', geeController.listCardsRecords);
        this.router.post('/', geeController.create);
        this.router.post('/GRecord', geeController.createGRecord);
        this.router.post('/FCard', geeController.createFCard);
        this.router.post('/FCardRecord', geeController.createCardRecord);
        this.router.post('/changeFuelPrice', geeController.changeFuelPrice);
        this.router.post('/adjustFTankExistence', geeController.adjustTankExistence);
        this.router.put('/:id', geeController.update);
        this.router.delete('/:id', geeController.delete);
        this.router.delete('/deleteGEERecord/:id', geeController.deleteGEERecord);
        this.router.delete('/deleteCardRecord/:id', geeController.deleteCardRecord);
        this.router.delete('/deleteFuelCard/:id', geeController.deleteFuelCard);
    }
}
const geeRoutes = new GEERoutes();
export default geeRoutes.router;