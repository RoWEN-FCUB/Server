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
const database_1 = __importDefault(require("../database"));
var jwt = require('jsonwebtoken');
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const nodemailer = require("nodemailer");
var hash = require('hash.js');
const keys_1 = __importDefault(require("../keys"));
class UsersController {
    slash(path) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }
        return path.replace(/\\/g, '/');
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.query('SELECT users.*, empresas.siglas, servicios.nombre AS nombre_servicio FROM users INNER JOIN empresas ON (users.id_emp = empresas.id) INNER JOIN servicios ON (users.id_serv = servicios.id) ORDER BY empresas.siglas', function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM users_roles', function (error, results, fields) {
                res.json(results);
                //console.log('Aqui van los roles '+results + error);
            });
        });
    }
    getSubordinados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT users.id, users.user, users.fullname, users.position FROM users WHERE id_sup = ?', [id], function (error, results, fields) {
                if (results.length > 0) {
                    res.json(results);
                }
                else {
                    res.json({ text: "Users not found" });
                }
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT * FROM users WHERE id = ?', [id], function (error, results, fields) {
                if (results.length > 0)
                    res.json(results[0]);
                else
                    res.json({ text: "User not found" });
            });
        });
    }
    getSuperior(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT users.fullname, users.position FROM users WHERE id = (SELECT id_sup FROM users WHERE id = ?);', [id], function (error, results, fields) {
                if (results.length > 0)
                    res.json(results[0]);
                else
                    res.json({ text: "User not found" });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            delete req.body.siglas;
            delete req.body.nombre_servicio;
            // console.log(req.body);
            req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
            yield database_1.default.query('INSERT INTO users set ?', [req.body], function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.json({ message: 'User saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.siglas;
            delete req.body.nombre_servicio;
            let oldpass = '';
            const resp = yield database_1.default.query('SELECT pass FROM users WHERE id = ?', [id], function (error, results, fields) {
                oldpass = results[0].pass;
                if (!(req.body.pass === oldpass)) {
                    req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
                }
                const result = database_1.default.query('UPDATE users set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                    res.json({ text: "User updated" });
                });
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const task = yield database_1.default.query('DELETE FROM tareas WHERE id_usuario = ?', [id]);
            const user = yield database_1.default.query('DELETE FROM users WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "User deleted" });
            });
        });
    }
    user_valid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const user = req.body.user;
            const id = req.body.id;
            if (typeof id !== 'undefined') {
                const resp = yield database_1.default.query('SELECT * FROM users WHERE users.id != ? AND (users.email = ? OR users.user = ?)', [id, email, user], function (error, results, fields) {
                    // console.log(results);
                    if (results[0]) {
                        res.json({ valid: false });
                    }
                    else {
                        res.json({ valid: true });
                    }
                });
            }
            else {
                const resp = yield database_1.default.query('SELECT * FROM users WHERE users.email = ? OR users.user = ?', [email, user], function (error, results, fields) {
                    // console.log(results);
                    if (results[0]) {
                        res.json({ valid: false });
                    }
                    else {
                        res.json({ valid: true });
                    }
                });
            }
        });
    }
    validate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            //console.log('Esto es lo que viene '+ req.body.email + ' ' + req.body.password);     
            //console.log(req.body);   
            //const upass = req.body.password;        
            const upass = hash.sha256().update(req.body.password).digest('hex');
            let path = path_1.default.join(__dirname, 'private.key');
            const isExtendedLengthPath = /^\\\\\?\\/.test(path);
            const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
            if (!isExtendedLengthPath && !hasNonAscii) {
                path = path.replace(/\\/g, '/');
            }
            //console.log(path);
            const RSA_PRIVATE_KEY = fs.readFileSync(path);
            const resp = yield database_1.default.query('SELECT users.id, users.email, users.picture, users.pass, users.user, users.fullname, users.position, users.id_sup, users.id_emp, users.id_serv, users.ci, users_roles.role, servicios.municipio FROM users INNER JOIN users_roles ON (users.role = users_roles.id) INNER JOIN servicios ON (users.id_serv=servicios.id) WHERE email = ?', [email], function (error, results, fields) {
                //console.log(results[0]);
                if (!results[0]) {
                    res.status(404).json({ text: 'Datos de usuario incorrectos' });
                }
                else {
                    if (results[0].pass === upass) {
                        const jwtBearerToken = jwt.sign({ id: results[0].id, role: results[0].role, name: results[0].user, picture: results[0].picture, fullname: results[0].fullname, position: results[0].position, id_sup: results[0].id_sup, id_emp: results[0].id_emp, id_serv: results[0].id_serv, ci: results[0].ci, municipio: results[0].municipio }, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 60,
                            subject: '' + results[0].id
                        });
                        res.json({ data: { token: jwtBearerToken, expiresIn: 60 } });
                        // console.log(res);
                    }
                    else {
                        res.status(404).json({ text: 'Datos de usuario incorrectos' });
                    }
                }
            });
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body.payload);
            const payload = req.body.payload;
            let path = path_1.default.join(__dirname, 'private.key');
            const isExtendedLengthPath = /^\\\\\?\\/.test(path);
            const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
            if (!isExtendedLengthPath && !hasNonAscii) {
                path = path.replace(/\\/g, '/');
            }
            const RSA_PRIVATE_KEY = fs.readFileSync(path);
            const jwtBearerToken = jwt.sign({ id: payload.id, role: payload.role, name: payload.name, picture: payload.picture, fullname: payload.fullname, position: payload.position, id_sup: payload.id_sup, id_emp: payload.id_emp, id_serv: payload.id_serv, ci: payload.ci, municipio: payload.municipio }, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 300,
                subject: '' + payload
            });
            res.json({ data: { token: jwtBearerToken, expiresIn: 300 } });
        });
    }
    SendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer.createTransport(keys_1.default.mail_server);
            let info = yield transporter.sendMail({
                from: '"CITMATEL" <carloslopezduranona@gmail.com>',
                to: to,
                subject: subject,
                //text: body, // plain text body
                html: body // html body
            });
        });
    }
}
const usersController = new UsersController();
exports.default = usersController;
