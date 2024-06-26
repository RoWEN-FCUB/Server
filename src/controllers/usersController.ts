import { Request, Response } from 'express';
import pool from '../database';
var jwt = require('jsonwebtoken');
//const { expressjwt: jwt } = require('express-jwt'); //this line will import the jwt middleware from Express-Jwt module.
import * as fs from 'fs';
import Path from 'path';
const nodemailer = require("nodemailer");
var hash = require('hash.js');
import keys from '../keys';


class UsersController{

    slash(path: string) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }

        return path.replace(/\\/g, '/');
    }

   public async list (req: Request,res: Response): Promise<void>{
        const users = await pool.query('SELECT users.*, empresas.siglas, servicios.nombre AS nombre_servicio FROM users INNER JOIN empresas ON (users.id_emp = empresas.id) INNER JOIN servicios ON (users.id_serv = servicios.id) ORDER BY empresas.siglas', function(error: any, results: any, fields: any){
            res.json(results);
        });
    }

    public async getRoles(req: Request,res: Response): Promise<void>{   
        const roles = await pool.query('SELECT * FROM users_roles', function(error: any, results: any, fields: any){
            res.json(results);
            //console.log('Aqui van los roles '+results + error);
        });    
    }

    public async getSubordinados(req: Request,res: Response): Promise<void>{ 
        const {id} = req.params;
        const user = await pool.query('SELECT users.id, users.user, users.fullname, users.position FROM users WHERE id_sup = ?', [id], function(error: any, results: any, fields: any){
            if(results.length > 0) {
                res.json(results);                
            }
            else {
                res.json({text:"Users not found"});
            }
        });
    }

    public async getOne (req: Request,res: Response): Promise<void>{        
        const {id} = req.params;
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [id], function(error: any, results: any, fields: any){
            if(results.length > 0)
            res.json(results[0]);
            else
            res.json({text:"User not found"});
        });
    }

    public async getSuperior (req: Request,res: Response): Promise<void>{        
        const {id} = req.params;
        const user = await pool.query('SELECT users.fullname, users.position FROM users WHERE id = (SELECT id_sup FROM users WHERE id = ?);', [id], function(error: any, results: any, fields: any){
            if(results.length > 0)
            res.json(results[0]);
            else
            res.json({text:"User not found"});
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.siglas;
        delete req.body.nombre_servicio;
        // console.log(req.body);
        req.body.pass = hash.sha256().update(req.body.pass).digest('hex');        
        await pool.query('INSERT INTO users set ?',[req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'User saved'});
        });       
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        delete req.body.siglas;
        delete req.body.nombre_servicio;
        let oldpass = '';
        const resp = await pool.query('SELECT pass FROM users WHERE id = ?', [id], function(error: any, results: any, fields: any){
            oldpass = results[0].pass;            
            if(!(req.body.pass === oldpass)) {
                req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
            }
            const result = pool.query('UPDATE users set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
                res.json({text:"User updated"});
            });
        });                      
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const task = await pool.query('DELETE FROM tareas WHERE id_usuario = ?', [id]);
        const user = await pool.query('DELETE FROM users WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"User deleted"});
        });        
    }

    public async user_valid(req: Request, res: Response): Promise<void> { //valida que los datos no esten duplicados
        const email = req.body.email;
        const user = req.body.user;
        const id = req.body.id;
        if (typeof id !== 'undefined') {
            const resp = await pool.query('SELECT * FROM users WHERE users.id != ? AND (users.email = ? OR users.user = ?)',[id, email, user], function(error: any, results: any, fields: any) {
                // console.log(results);
                if(results[0]) {
                    res.json({valid: false});                
                } else {
                    res.json({valid: true});                
                }
            });
        } else {
            const resp = await pool.query('SELECT * FROM users WHERE users.email = ? OR users.user = ?',[email, user], function(error: any, results: any, fields: any) {
                // console.log(results);
                if(results[0]) {
                    res.json({valid: false});                
                } else {
                    res.json({valid: true});                
                }
            });
        }        
    }

    public async validate(req: Request, res: Response): Promise<void>{        
        const email = req.body.email;
        //console.log('Esto es lo que viene '+ req.body.email + ' ' + req.body.password);     
        //console.log(req.body);   
        //const upass = req.body.password;        
        const upass = hash.sha256().update(req.body.password).digest('hex');
        let path = Path.join(__dirname, 'private.key');
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
        if (!isExtendedLengthPath && !hasNonAscii) {
            path = path.replace(/\\/g, '/');
        }
        //console.log(path);
        const RSA_PRIVATE_KEY = fs.readFileSync(path);
        const resp = await pool.query('SELECT users.id, users.email, users.picture, users.pass, users.user, users.fullname, users.position, users.id_sup, users.id_emp, users.id_serv, users.ci, users_roles.role, servicios.municipio FROM users INNER JOIN users_roles ON (users.role = users_roles.id) INNER JOIN servicios ON (users.id_serv=servicios.id) WHERE email = ?',[email], function(error: any, results: any, fields: any){
            //console.log(results[0]);
            if(results.length === 0 || results === undefined || results === null){
                res.status(401).json({error: 'Datos de usuario incorrectos'});
            } else {
                if(results[0].pass === upass) {
                    try {
                        const jwtBearerToken = jwt.sign({id: results[0].id, role: results[0].role, name: results[0].user, picture: results[0].picture, fullname: results[0].fullname, position: results[0].position, id_sup: results[0].id_sup, id_emp: results[0].id_emp, id_serv: results[0].id_serv, ci: results[0].ci, municipio: results[0].municipio}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            allowInsecureKeySizes: true, // allow keys of any size, but would be impractical for production usage
                            expiresIn: 300,
                            subject: '' + results[0].id
                        });
                        res.status(200).json({data: {token: jwtBearerToken, expiresIn: 300}});
                    } catch (err) {
                        console.log(err);
                        res.status(500).json({error: 'Error en el servidor'});
                    } 
                    // console.log(res);
                } else {
                    res.status(401).json({error: 'Datos de usuario incorrectos'});
                }
            }            
        });
    }

    public async refresh(req: Request, res: Response): Promise<void>{
        // console.log(req.body.payload);
        const payload = req.body.payload;
        let path = Path.join(__dirname, 'private.key');
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
        if (!isExtendedLengthPath && !hasNonAscii) {
            path = path.replace(/\\/g, '/');
        }
        const RSA_PRIVATE_KEY = fs.readFileSync(path);
        const jwtBearerToken = jwt.sign({id: payload.id, role: payload.role, name: payload.name, picture: payload.picture, fullname: payload.fullname, position: payload.position, id_sup: payload.id_sup, id_emp: payload.id_emp, id_serv: payload.id_serv, ci: payload.ci, municipio: payload.municipio}, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            allowInsecureKeySizes: true, // allow keys of any size, but would be impractical for production usage
            expiresIn: 1200,
            subject: '' + payload
        });
        res.json({data: {token: jwtBearerToken, expiresIn: 1200}});
    }

    public async SendEmail(to: string, subject: string, body: string) {
        let transporter = nodemailer.createTransport(keys.mail_server);        
        let info = await transporter.sendMail({
            from: '"CITMATEL" <carloslopezduranona@gmail.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: body, // plain text body
            html: body // html body
        });
    }
}

const usersController = new UsersController();
export default usersController;