import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';

const bodyParser = require('body-parser');

var jwt = require('express-jwt');
import * as fs from 'fs';
import Path from "path";
const slash = require('slash');


import indexRoutes from './routes/indexRoutes';
import usersRoutes from './routes/usersRoutes';
import taskRoutes from './routes/taskRoutes';
import rolesRoutes from './routes/rolesRoutes';
import avatarRoutes from './routes/avatarRoutes';
import notificationRoutes from './routes/notificationRoutes';
import taskController from './controllers/taskController';
var dir = Path.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');


class Server{
    public app: Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();
        //usersController.SendEmail();
        //console.log(dir);        
    }

    config(): void{
        this.app.set('port', process.env.port || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        //this.app.use(fileUpload());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    routes(): void{
        this.app.use('/public',express.static(dir));
        const RSA_PUBLIC_KEY = fs.readFileSync(slash(Path.join(__dirname, 'public.key')));
        this.app.use(jwt({secret: RSA_PUBLIC_KEY}).unless({path:['/user/login']}));
        this.app.use('/',indexRoutes);        
        this.app.use('/user', usersRoutes);
        this.app.use('/task', taskRoutes);
        this.app.use('/roles', rolesRoutes);
        this.app.use('/avatar',avatarRoutes);
        this.app.use('/notifications', notificationRoutes);
    }

    delay(milliseconds: number, count: number): Promise<number> {
        return new Promise<number>(resolve => {
                setTimeout(() => {
                    resolve(count);
                }, milliseconds);
            });
    }
    
    // revisa y actualiza la base de datos
    async verify(): Promise<void> {
        //console.log("Hello");
        while (true) {
            await this.delay(60000,1);
            console.log('Buscando tareas incumplidas...');
            taskController.search_failed_tasks();
            taskController.send_Tasks();
            //console.log('Esto se ejecuta cada 1 seg');
        }  
    }

    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port:',this.app.get('port'))
        });
        this.verify();
    }
}

const server = new Server();
server.start();
