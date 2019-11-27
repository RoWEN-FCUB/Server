import { Request, Response } from 'express';
import pool from '../database';
var jwt = require('jsonwebtoken');
import * as fs from 'fs';
import Path from "path";
const slash = require('slash');
const nodemailer = require("nodemailer");
var hash = require('hash.js');
import keys from '../keys';


class UsersController{

   public async list (req: Request,res: Response): Promise<void>{
        const users = await pool.query('SELECT * FROM users', function(error: any, results: any, fields: any){
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
        const user = await pool.query('SELECT users.id, users.user FROM users WHERE id_sup = ?', [id], function(error: any, results: any, fields: any){
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

    public async create(req: Request, res: Response): Promise<void>{
        req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
        console.log(req.body);
        await pool.query('INSERT INTO users set ?',[req.body], function(error: any, results: any, fields: any) {
            res.json({message: 'User saved'});
        });       
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
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
        const id = req.body.id;
        const user = req.body.user;
        if (id) {
            const resp = await pool.query('SELECT * FROM users WHERE users.id != ? AND (users.email = ? OR users.user = ?)',[id, email, user], function(error: any, results: any, fields: any) {
                console.log(results);
                if(results[0]) {
                    res.json({valid: false});                
                } else {
                    res.json({valid: true});                
                }
            });
        } else {
            const resp = await pool.query('SELECT * FROM users WHERE users.email = ? OR users.user = ?',[email, user], function(error: any, results: any, fields: any) {
                console.log(results);
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
        //console.log('Esto es lo que viene '+req.body.password);        
        //const upass = req.body.password;        
        const upass = hash.sha256().update(req.body.password).digest('hex');                
        const RSA_PRIVATE_KEY = fs.readFileSync(slash(Path.join(__dirname, 'private.key')));
        const resp = await pool.query('SELECT users.id, users.email, users.picture, users.pass, users.user, users_roles.role FROM users INNER JOIN users_roles ON (users.role = users_roles.id) WHERE email = ?',[email], function(error: any, results: any, fields: any){
            //console.log(results[0]);
            if(!results[0]){
                res.status(404).json({text: 'Datos de usuario incorrectos'});
            } else {
                if(results[0].pass === upass) {                    
                    const jwtBearerToken = jwt.sign({id: results[0].id, role: results[0].role, name: results[0].user, picture: results[0].picture}, RSA_PRIVATE_KEY, {
    
                        algorithm: 'RS256',
        
                        expiresIn: 3600,
        
                        subject: ''+results[0].id
        
                    });
                    //console.log(jwtBearerToken);                    
                    res.json({token: jwtBearerToken, expiresIn: 3600});
                } else {
                    res.status(404).json({text: 'Datos de usuario incorrectos'});
                }
            }            
        });
    }

    public async SendEmail(to: string, subject: string, body: string) {
        let transporter = nodemailer.createTransport(keys.mail_server);        
        let info = await transporter.sendMail({
            from: '"Carlos" <carlos@ltunas.inf.cu>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: body, // plain text body
            html: body // html body
        });
    }
}

const usersController = new UsersController();
export default usersController;