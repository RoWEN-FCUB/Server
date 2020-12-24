import { Router } from 'express';
import companyController from '../controllers/companyController';

class CompanyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list', companyController.list);
    }
}
const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;