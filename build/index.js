"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = require('body-parser');
var jwt = require('express-jwt');
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const slash = require('slash');
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
var dir = path_1.default.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');
const nodemailer = require("nodemailer");
const https = require('https');
const http = require('http');
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        // this.SendEmail();      
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
                logger: true,
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
        this.app.set('port', process.env.port || 3128);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        /*var corsMiddleware = function(req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '169.158.137.122'); //replace localhost with actual host
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
            next();
        }
        this.app.use(corsMiddleware);*/
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        //this.app.use(fileUpload());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }
    routes() {
        this.app.use('/public', express_1.default.static(dir));
        const RSA_PUBLIC_KEY = fs.readFileSync(slash(path_1.default.join(__dirname, 'public.key')));
        this.app.use(jwt({ secret: RSA_PUBLIC_KEY }).unless({ path: ['/user/login'] }));
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
                //console.log('Esto se ejecuta cada 1 seg');
            }
        });
    }
    start() {
        const httpServer = http.createServer(this.app);
        const httpsServer = https.createServer({
            key: fs.readFileSync(slash(path_1.default.join(__dirname, 'apache-selfsigned.key'))),
            cert: fs.readFileSync(slash(path_1.default.join(__dirname, 'apache-selfsigned.crt'))),
        }, this.app);
        /*httpServer.listen(3128, () => {
            console.log('HTTP Server running on port 80');
        });*/
        httpsServer.listen(3128, () => {
            console.log('HTTPS Server running on port 3128');
        });
        /*this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port:',this.app.get('port'));
        });*/
        this.verify();
    }
}
const server = new Server();
server.start();
