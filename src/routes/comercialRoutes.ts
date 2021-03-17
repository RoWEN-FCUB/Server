import { Router } from 'express';
import comercialController from '../controllers/comercialController';
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './public' });

class CompanyRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/listProviders/:id_empresa', comercialController.listProviders);
        this.router.get('/listProducts/:id_proveedor', comercialController.listProducts);
        this.router.get('/listReceipts/:id_proveedor&:concilied&:delivered', comercialController.listReceipts);
        this.router.get('/listReceiptProducts/:id_receipt', comercialController.listReceiptProducts);
        this.router.get('/searchreceipts/:str&:page&:id_provider&:concilied&:delivered', comercialController.searchReceipts);
        this.router.post('/product', comercialController.createProduct);
        this.router.post('/provider', comercialController.createProvider);
        this.router.post('/receipt', comercialController.createReceipt);
        this.router.put('/product/:id', comercialController.updateProduct);
        this.router.put('/provider/:id', comercialController.updateProvider);
        this.router.put('/receipt/:id', comercialController.updateReceipt);
        this.router.delete('/product/:id', comercialController.deleteProduct);
        this.router.delete('/provider/:id', comercialController.deleteProvider);
        this.router.delete('/receipt/:id', comercialController.deleteReceipt);
        this.router.post('/upload', multipartMiddleware, comercialController.upload);
    }
}
const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;