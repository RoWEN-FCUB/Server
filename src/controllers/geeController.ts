import { Request, Response } from 'express';
import pool from '../database';

class GEEController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const gees = await pool.query("SELECT gee.id, gee.id_emp, gee.id_serv, gee.idgee, gee.marca, gee.kva, gee.ic_scarga, gee.ic_ccargad, gee.ic_ccargan, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async getFuelPrices(req: Request, res: Response): Promise<void>{
        await pool.query('SELECT configuracion.precio_dregular as precio_dregular, configuracion.precio_gregular as precio_gregular FROM configuracion;', function(error: any, results: any, fields: any){
            res.json(results[0]);
        });
    }

    public async listRecords (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gees = await pool.query("SELECT * FROM gee_registro WHERE id_gee = ? ORDER BY id DESC;", [id], function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }
    
    public async listGEEByUser (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gees = await pool.query("SELECT gee.*, servicios.nombre as servicio, empresas.siglas as empresa, empresas.oace as oace FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) INNER JOIN servicios ON (gee.id_serv = servicios.id) INNER JOIN empresas ON (servicios.id_emp = empresas.id) WHERE users.id = ?;", [id], function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async listCardsbyGEE (req: Request, res: Response):  Promise<void>{
        const {id_gee} = req.params;
        const gees = await pool.query("SELECT * FROM tarjetas WHERE id_gee = ?;", [id_gee], function(error: any, results: any, fields: any){            
            res.json(results);
        });
    }

    public async listCardsRecords (req: Request, res: Response):  Promise<void>{
        const {id_card} = req.params;
        const gees = await pool.query("SELECT * FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id ASC;", [id_card], function(error: any, results: any, fields: any){            
            res.json(results);
        });
    }

    public async create(req: Request, res: Response): Promise<void>{
        delete req.body.id;
        await pool.query('INSERT INTO gee SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'GEE saved'});
        });
    }

    public async createFCard(req: Request, res: Response): Promise<void> {
        delete req.body.id;
        await pool.query('INSERT INTO tarjetas SET ?', [req.body], function(error: any, results: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'FCard saved'});
        });
    }

    public async createCardRecord(req: Request, res: Response):  Promise<void>{
        delete req.body.id;
        req.body.fecha = req.body.fecha.substring(0, req.body.fecha.indexOf('T'));
        await pool.query('SELECT tipo_combustible FROM tarjetas WHERE id = ?',[req.body.id_tarjeta], async (error: any, results: any, fields: any) =>{
            const tipo_combustible = results[0].tipo_combustible;
            console.log(tipo_combustible);
            await pool.query('SELECT * FROM configuracion', async (error: any, configuracion: any, fields: any) =>{
                let precio_combustible = 0;
                console.log(configuracion);
                if (tipo_combustible === 'Diesel Regular') {
                    precio_combustible = configuracion[0].precio_dregular;
                } else if (tipo_combustible === 'Gasolina') {
                    precio_combustible = configuracion[0].precio_gregular;
                }
                req.body.sinicial_litros = geeController.round(req.body.sinicial_pesos / precio_combustible, 2);
                req.body.sfinal_litros = geeController.round(req.body.sfinal_pesos / precio_combustible , 2);
                if (req.body.recarga_pesos) {
                    req.body.recarga_litros = geeController.round(req.body.recarga_pesos / precio_combustible, 2);
                    req.body.saldo_litros = geeController.round(req.body.saldo_pesos / precio_combustible, 2);
                }
                if (req.body.consumo_pesos) {
                    req.body.consumo_litros = geeController.round(req.body.consumo_pesos / precio_combustible, 2);
                }
                console.log(req.body);
                await pool.query('INSERT INTO tarjetas_registro SET ?', [req.body], async (errors: any, result: any, fields:any) => {
                    res.json({message: 'FCard Record saved'});
                });
            });
        });
    }

    public round(numb: number, precision: number) {
        const exp: number = Math.pow(10, precision);
        return Math.round( ( numb + Number.EPSILON ) * exp ) / exp;
    }

    public async update(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        delete req.body.id;
        delete req.body.empresa;
        delete req.body.servicio;
        delete req.body.provincia;
        delete req.body.municipio;
        // console.log(req.body);
        const result = pool.query('UPDATE gee set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            if (error) {
                console.log(error);
            }
            res.json({text:"Gee updated"});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gee = await pool.query('DELETE FROM gee WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"GEE deleted"});
        });        
    }

    public async deleteCardRecord(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const gee = await pool.query('DELETE FROM tarjetas_registro WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"CardRecord deleted"});
        });        
    }
}
const geeController = new GEEController();
export default geeController;