import { Router } from 'express';
import comercialController from '../controllers/comercialController';

class CompanyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/listProviders/:id_empresa', comercialController.listProviders);
        this.router.get('/listProducts/:id_proveedor', comercialController.listProducts);
        this.router.get('/listReceipts/:id_proveedor&:concilied&:delivered', comercialController.listReceipts);
    }
}
const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;