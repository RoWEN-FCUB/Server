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
var dir = path_1.default.join(__dirname, 'public');
//const fileUpload = require('express-fileupload');
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        //usersController.SendEmail();
        //console.log(dir);        
    }
    config() {
        this.app.set('port', process.env.port || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
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
                yield this.delay(60000, 1);
                console.log('Buscando tareas incumplidas...');
                taskController_1.default.search_failed_tasks();
                //console.log('Esto se ejecuta cada 1 seg');
            }
        });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port:', this.app.get('port'));
        });
        this.verify();
    }
}
const server = new Server();
server.start();
