import { Router } from 'express';
import comercialController from '../controllers/comercialController';

class CompanyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/listProviders/:id_empresa', comercialController.listProviders);
    }
}
const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;