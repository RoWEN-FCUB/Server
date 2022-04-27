"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import morgan from 'morgan';
var morgan = require('morgan');
// import cors from 'cors';
var cors = require('cors');
const bodyParser = require('body-parser');
var jwt = require('express-jwt');
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const avatarRoutes_1 = __importDefault(require("./routes/avatarRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const taskController_1 = __importDefault(require("./controllers/taskController"));
const workshopRoutes_1 = __importDefault(require("./routes/workshopRoutes"));
const energyRoutes_1 = __importDefault(require("./routes/energyRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const comercialRoutes_1 = __importDefault(require("./routes/comercialRoutes"));
const weatherRoutes_1 = __importDefault(require("./routes/weatherRoutes"));
var dir = path_1.default.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');
const nodemailer = require("nodemailer");
//const https = require('https');
const http = require('http');
// exports.requireSignin =  jwt({ secret:  process.env.JWT_SECRET, algorithms: ['RS256'] });
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        // this.SendEmail();      
    }
    slash(path) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }
        return path.replace(/\\/g, '/');
    }
    SendEmail() {
        return __awaiter(this, void 0, void 0, function* () {
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
                debug: true,
                logger: true, // log information in console
                /*tls: {
                    // rejectUnauthorized: false,
                    ciphers:'SSLv3'
                },*/
                // requireTLS:true,
                // ignoreTLS: true
            });
            // verify connection configuration
            transporter.verify(function (error, success) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Server is ready to take our messages');
                        try {
                            let info = yield transporter.sendMail({
                                from: "carloslopezduranona@gmail.com",
                                to: "carloslopezduranona@gmail.com",
                                subject: "Hello ",
                                text: "Hello world?",
                                html: "<b>Hello world?</b>" // html body
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }
                        ;
                    }
                });
            });
        });
    }
    config() {
        /*var corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }*/
        this.app.set('port', process.env.port || 443);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        /*var corsMiddleware = function(req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '169.158.137.122'); //replace localhost with actual host
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
            next();
        }
        this.app.use(corsMiddleware);*/
        /*this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });*/
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        //this.app.use(fileUpload());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }
    routes() {
        this.app.use('/public', express_1.default.static(dir));
        const RSA_PUBLIC_KEY = fs.readFileSync(this.slash(path_1.default.join(__dirname, 'public.key')));
        this.app.use(jwt({ secret: RSA_PUBLIC_KEY, algorithms: ['RS256'] }).unless({ path: ['/user/login', '/user/refresh'] }));
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/user', usersRoutes_1.default);
        this.app.use('/task', taskRoutes_1.default);
        this.app.use('/roles', rolesRoutes_1.default);
        this.app.use('/avatar', avatarRoutes_1.default);
        this.app.use('/notifications', notificationRoutes_1.default);
        this.app.use('/workshop', workshopRoutes_1.default);
        this.app.use('/energy', energyRoutes_1.default);
        this.app.use('/company', companyRoutes_1.default);
        this.app.use('/service', serviceRoutes_1.default);
        this.app.use('/comercial', comercialRoutes_1.default);
        this.app.use('/weather', weatherRoutes_1.default);
    }
    delay(milliseconds, count) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(count);
            }, milliseconds);
        });
    }
    // revisa y actualiza la base de datos
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Hello");
            while (true) {
                yield this.delay(600000, 1);
                console.log('Buscando tareas incumplidas...');
                taskController_1.default.search_failed_tasks();
                taskController_1.default.send_Tasks();
                //console.log('Esto se ejecuta cada 10 min');
            }
        });
    }
    start() {
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
    }
}
const server = new Server();
server.start();
