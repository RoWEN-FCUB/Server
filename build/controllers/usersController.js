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
const database_1 = __importDefault(require("../database"));
var jwt = require('jsonwebtoken');
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const slash = require('slash');
const nodemailer = require("nodemailer");
var hash = require('hash.js');
const keys_1 = __importDefault(require("../keys"));
class UsersController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.query('SELECT * FROM users', function (error, results, fields) {
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
            const user = yield database_1.default.query('SELECT users.id, users.user FROM users WHERE id_sup = ?', [id], function (error, results, fields) {
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
            console.log(req.body);
            yield database_1.default.query('INSERT INTO users set ?', [req.body], function (error, results, fields) {
                res.json({ message: 'User saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
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
            const id = req.body.id;
            const user = req.body.user;
            if (id) {
                const resp = yield database_1.default.query('SELECT * FROM users WHERE users.id != ? AND (users.email = ? OR users.user = ?)', [id, email, user], function (error, results, fields) {
                    console.log(results);
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
                    console.log(results);
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
            //console.log('Esto es lo que viene '+req.body.password);        
            //const upass = req.body.password;        
            const upass = hash.sha256().update(req.body.password).digest('hex');
            const RSA_PRIVATE_KEY = fs.readFileSync(slash(path_1.default.join(__dirname, 'private.key')));
            const resp = yield database_1.default.query('SELECT users.id, users.email, users.picture, users.pass, users.user, users_roles.role FROM users INNER JOIN users_roles ON (users.role = users_roles.id) WHERE email = ?', [email], function (error, results, fields) {
                //console.log(results[0]);
                if (!results[0]) {
                    res.status(404).json({ text: 'Datos de usuario incorrectos' });
                }
                else {
                    if (results[0].pass === upass) {
                        const jwtBearerToken = jwt.sign({ id: results[0].id, role: results[0].role, name: results[0].user, picture: results[0].picture }, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 3600,
                            subject: '' + results[0].id
                        });
                        //console.log(jwtBearerToken);                    
                        res.json({ token: jwtBearerToken, expiresIn: 3600 });
                    }
                    else {
                        res.status(404).json({ text: 'Datos de usuario incorrectos' });
                    }
                }
            });
        });
    }
    SendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer.createTransport(keys_1.default.mail_server);
            let info = yield transporter.sendMail({
                from: '"Carlos" <carlos@ltunas.inf.cu>',
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
