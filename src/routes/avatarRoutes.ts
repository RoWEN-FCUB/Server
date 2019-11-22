import { Router } from 'express';
import avatarController from '../controllers/avatarController';
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './public' });

class AvatarRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{                
        this.router.post('/', multipartMiddleware, avatarController.create);
        //this.router.put('/:id', usersController.update);
        //this.router.delete('/:id', usersController.delete);
    }
}
const avatarRoutes = new AvatarRoutes();
export default avatarRoutes.router;