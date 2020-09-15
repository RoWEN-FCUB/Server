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
import workshopRoutes from './routes/workshopRoutes'

var dir = Path.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');

const nodemailer = require("nodemailer");

class Server{
    public app: Application;
    
    constructor(){
        this.app = express();
        this.config();
        this.routes();
        //this.SendEmail();      
    }

    async SendEmail() {
        let transporter = nodemailer.createTransport({
            host: "169.158.143.131",
            port: 443, //587
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'carlos',
              pass: 'David.18'
            },
            debug: true, // show debug output
            logger: true, // log information in console
            tls: {
                rejectUnauthorized: false,
                //ciphers:'SSLv3'
            },            
            //requireTLS:true,
            ignoreTLS: true
          });
        // verify connection configuration
        transporter.verify(async function(error: any, success: any) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
                try {
                    let info = await transporter.sendMail({
                        from: '"Carlos" <carlos@ltunas.inf.cu>', // sender address
                        to: "carlos@ltunas.inf.cu", // list of receivers
                        subject: "Hello ", // Subject line
                        text: "Hello world?", // plain text body
                        html: "<b>Hello world?</b>" // html body
                    });
                } catch (error) {
                    console.log(error);
                };  
            }
        });                  
    }

    config(): void{
        /*var corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }*/
        this.app.set('port', process.env.port || 3128);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        /*var corsMiddleware = function(req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '169.158.137.122'); //replace localhost with actual host
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');        
            next();
        }        
        this.app.use(corsMiddleware);*/
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
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
        this.app.use('/workshop', workshopRoutes);
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
        this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port:',this.app.get('port'))
        });
        //this.verify();
    }
}

const server = new Server();
server.start();
