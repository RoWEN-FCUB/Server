import { Router } from 'express';
import companyController from '../controllers/companyController';

class CompanyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/list', companyController.list);
        this.router.get('/get/:id', companyController.getOne);
        this.router.post('/', companyController.create);
        this.router.put('/:id', companyController.update);
        this.router.delete('/:id', companyController.delete);
    }
}
const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;