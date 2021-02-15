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
        this.router.get('/marcs/:equipo', workshopController.listMarcs);
        this.router.get('/partmarcs/:part', workshopController.listPartMarcs);
        this.router.get('/partcaps/:part', workshopController.listPartCaps);
        this.router.get('/partmodels/:part&:marc', workshopController.listPartModels);
        this.router.get('/models/:equipo&:marca', workshopController.listModels);
        this.router.get('/serials/:equipo&:marca&:modelo', workshopController.listSerialsInv);
        this.router.get('/names/:id_cliente', workshopController.listNames);
        this.router.get('/listperson/:name', workshopController.listPerson);
        this.router.get('/parts/:id_reg', workshopController.listParts);
        this.router.get('/allparts', workshopController.listAllParts);
        this.router.post('/', workshopController.create);
        this.router.post('/createwperson', workshopController.createWPerson);
        this.router.get('/search/:str&:page&:id_emp', workshopController.search);
        this.router.put('/:id', workshopController.update);
        this.router.post('/updateparts', workshopController.updateParts);
        this.router.delete('/:id', workshopController.delete);
        this.router.delete('/parts/:id', workshopController.deletePart);
        this.router.delete('/wclient/:id', workshopController.deleteWCLient);
        this.router.delete('/wdevice/:wdev', workshopController.deleteWDevice);
    }
}
const workshopRoutes = new WorkshopRoutes();
export default workshopRoutes.router;