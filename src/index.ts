import express, {Application} from 'express';
// import morgan from 'morgan';
var morgan = require('morgan');
// import cors from 'cors';
var cors = require('cors');
var fetch = require('node-fetch');
const bodyParser = require('body-parser');

//var jwt = require('express-jwt');
const { expressjwt: jwt } = require('express-jwt');
import * as fs from 'fs';
import Path from 'path';

import indexRoutes from './routes/indexRoutes';
import usersRoutes from './routes/usersRoutes';
import taskRoutes from './routes/taskRoutes';
import rolesRoutes from './routes/rolesRoutes';
import avatarRoutes from './routes/avatarRoutes';
import notificationRoutes from './routes/notificationRoutes';
import taskController from './controllers/taskController';
import workshopRoutes from './routes/workshopRoutes';
import energyRoutes from './routes/energyRoutes';
import companyRoutes from './routes/companyRoutes';
import serviceRoutes from './routes/serviceRoutes';
import comercialRoutes from './routes/comercialRoutes';
import weatherRoutes from './routes/weatherRoutes';
import deliverRoutes from './routes/deliverRoutes';
import geeRoutes from './routes/geeRoutes';

var dir = Path.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');

const nodemailer = require("nodemailer");
//const https = require('https');
const http = require('http');
// exports.requireSignin =  jwt({ secret:  process.env.JWT_SECRET, algorithms: ['RS256'] });

class Server{
    public app: Application;
    
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    slash(path: string) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    
        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }
    
        return path.replace(/\\/g, '/');
    }

    async SendEmail() {
        let transporter = nodemailer.createTransport({
            /*host: "smtp.gmail.com",
            port: 587,
            ssl: true,
            tls: true,*/
            service: 'gmail',
            auth: {
                user: "carloslopezduranona@gmail.com",
                pass: "David.18"
            },
            debug: true, // show debug output
            logger: true, // log information in console
            /*tls: {
                // rejectUnauthorized: false,
                ciphers:'SSLv3'
            },*/            
            // requireTLS:true,
            // ignoreTLS: true
          });
        // verify connection configuration
        transporter.verify(async function(error: any, success: any) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
                try {
                    let info = await transporter.sendMail({
                        from: "carloslopezduranona@gmail.com", // sender address
                        to: "carloslopezduranona@gmail.com", // list of receivers
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
        this.app.set('port', process.env.port || 443);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));        
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        
    }

    routes(): void{
        this.app.use('/public',express.static(dir));
        this.app.use(function (err: any, req: any, res: any, next: any) {
            if (err.name === "UnauthorizedError") {
              res.status(401).send("invalid token...");
            } else {
              next(err);
            }
          });
        const RSA_PUBLIC_KEY = fs.readFileSync(this.slash(Path.join(__dirname, 'public.key')));
        this.app.use(jwt({secret: RSA_PUBLIC_KEY, algorithms: ['RS256'], onExpired: async (req: any, err: any) => {
            console.log('Token expirado');
            throw err;
          }}).unless({path:['/user/login', '/user/refresh']}));
        this.app.use('/',indexRoutes);        
        this.app.use('/user', usersRoutes);
        this.app.use('/task', taskRoutes);
        this.app.use('/roles', rolesRoutes);
        this.app.use('/avatar',avatarRoutes);
        this.app.use('/notifications', notificationRoutes);
        this.app.use('/workshop', workshopRoutes);
        this.app.use('/energy', energyRoutes);
        this.app.use('/company', companyRoutes);
        this.app.use('/service', serviceRoutes);
        this.app.use('/comercial', comercialRoutes);
        this.app.use('/weather', weatherRoutes);
        this.app.use('/deliver', deliverRoutes);
        this.app.use('/gee', geeRoutes);
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
            await this.delay(600000,1);
            console.log('Buscando tareas incumplidas...');
            taskController.search_failed_tasks();
            taskController.send_Tasks();
            //console.log('Esto se ejecuta cada 10 min');
        }  
    }

    async testDeliver() : Promise <void> {        
        const params = new URLSearchParams();
        params.append('auth_login', 'yaro');
        params.append('auth_password', 'yaro.2021');
        const url = 'http://mall.cuba.cu/backend/index.php';
        const url2 = 'http://mall.cuba.cu/backend/pedido.php?action=DgJson&page=1&sortField=1&sortOrder=asc&show=10&filtroPedidoCodigoDesde=B4085124&filtroPedidoCodigoHasta=B4085124';
        const response = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {'Connection': "keep-alive"}
        }).then((res0: any) => {
            const response2 = fetch(url2, {method: 'GET', headers: {'Cookie': res0.headers.raw()['set-cookie'][0].substr(0, res0.headers.raw()['set-cookie'][0].indexOf(";"))}}).then(
                (res01: any) => res01.json()
            ).then((text:any) => console.log(text['rows']));
        });
    }

    start(): void{
        const httpServer = http.createServer(this.app);
        /*const httpsServer = https.createServer({
            key: fs.readFileSync(this.slash(Path.join(__dirname, 'apache-selfsigned.key'))),
            cert: fs.readFileSync(this.slash(Path.join(__dirname, 'apache-selfsigned.crt'))),
          }, this.app);*/
        
        httpServer.listen(443, () => {
            console.log('HTTP Server running on port 443');
        });
        
        /*httpsServer.listen(80, () => {
            console.log('HTTPS Server running on port 80');
        });*/

        /*this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port:',this.app.get('port'));            
        });*/
        // this.verify();
        // this.testDeliver();
    }
}

const server = new Server();
server.start();
