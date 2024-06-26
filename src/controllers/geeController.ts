import { Request, Response } from 'express';
import moment from 'moment';
import pool from '../database';

class GEEController {
    constructor() {}

    public async list (req: Request, res: Response): Promise<void>{
        const gees = await pool.query("SELECT gee.*, empresas.siglas as empresa, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio FROM gee INNER JOIN empresas ON (gee.id_emp = empresas.id) INNER JOIN servicios ON (gee.id_serv = servicios.id);", function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async getFuelTypes(req: Request, res: Response): Promise<void>{
        /*await pool.query('SELECT configuracion.precio_dregular as precio_dregular, configuracion.precio_gregular as precio_gregular FROM configuracion;', function(error: any, results: any, fields: any){
            res.json(results[0]);
        });*/
        await pool.query('SELECT * FROM tipos_combustibles;', function(error: any, results: any, fields: any){
            res.json(results);
        });
    }

    /*
    public async getFuelExistenceByGee(req: Request, res: Response): Promise <void> {
        const {id_gee} = req.params;
        let existence = 0;
        await pool.query("SELECT SUM(sfinal_litros) as saldofinal FROM (SELECT id, sfinal_litros FROM tarjetas_registro WHERE id_gee = ? HAVING id IN (SELECT max(id) FROM tarjetas_registro WHERE id_gee = ? GROUP BY id_tarjeta)) as subquery", [id_gee, id_gee], async function(error: any, results: any, fields: any){
            if (results.length > 0) {
                console.log(results);
                existence += results[0].saldofinal;  // saldofinal en tarjetas
            }
            await pool.query("SELECT existencia FROM gee_tanque WHERE id_gee = ? ORDER BY id DESC LIMIT 1", [id_gee], 	function(error: any, results: any, fields: any) {
                if (results.length > 0) {
                    console.log(results);
                    existence += results[0].existencia;  // existencia en tanque
                }
                res.json({existencia: existence});
            });
        });
    }*/

    public async listRecords (req: Request, res: Response): Promise<void>{
        const id: number = Number(req.params.id);
        const page: number = Number(req.params.page);
        const limit: number = Number(req.params.limit);
        await pool.query("SELECT count(id) as total_records FROM gee_registro WHERE id_gee = ?;", [id], async function(error: any, results: any, fields: any){
            if(error) {
                console.log(error);
            }
            const count = results[0].total_records;
            await pool.query("SELECT * FROM gee_registro WHERE id_gee = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id, limit, ((page - 1) * limit)], (error: any, results: any, fields: any) => {            
                if(error) {
                    console.log(error);
                }
                res.json({records :results, total_items: count});
            });
        });        
    }

    public async listRecordsByDate(req: Request, res: Response): Promise<void> {
        const id: number = Number(req.params.id);
        const fecha_inicial: string = req.params.fecha_inicial;
        const fecha_final: string = req.params.fecha_final;
        const query: string = "SELECT * FROM gee_registro WHERE id_gee = ? AND STR_TO_DATE(CONCAT(A, '-', M, '-', D), '%Y-%m-%d') >= ? AND STR_TO_DATE(CONCAT(A, '-', M, '-', D), '%Y-%m-%d') <= ? ORDER BY id ASC";
        await pool.query(query, [id, fecha_inicial, fecha_final], (error: any, results: any, fields: any) => {
            if(error) {
                console.log(error);
            }
            res.json(results);
        })
    }
    
    public async listGEEByUser (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query("SELECT gee.*, servicios.nombre as servicio, servicios.provincia as provincia, servicios.municipio as municipio, empresas.siglas as empresa, empresas.oace as oace FROM gee INNER JOIN usuario_servicio ON (gee.id_serv = usuario_servicio.id_servicio) INNER JOIN users ON (usuario_servicio.id_usuario = users.id) INNER JOIN servicios ON (gee.id_serv = servicios.id) INNER JOIN empresas ON (servicios.id_emp = empresas.id) WHERE users.id = ?;", [id], function(error: any, results: any, fields: any){            
            res.json(results);        
        });
    }

    public async listCardsbyGEE (req: Request, res: Response):  Promise<void>{
        const {id_gee} = req.params;
        await pool.query("SELECT tarjetas.*, tipos_combustibles.precio AS precio_combustible, tipos_combustibles.tipo_combustible as nombre_combustible FROM tarjetas LEFT JOIN tipos_combustibles ON (tarjetas.tipo_combustible = tipos_combustibles.id) WHERE id_gee = ?;", [id_gee], function(error: any, results: any, fields: any){            
            res.json(results);
        });
    }

    public async listTanksbyGEE (req: Request, res: Response):  Promise<void>{
        const id_gee: number = Number(req.params.id_gee);
        const page: number = Number(req.params.page);
        const limit: number = Number(req.params.limit);
        await pool.query("SELECT count(id) as total_records FROM gee_tanque WHERE id_gee = ?;", [id_gee], async (error: any, results: any, fields: any) => {            
            if(error) {
                console.log(error);
            }
            const count = results[0].total_records;
            await pool.query("SELECT * FROM gee_tanque WHERE id_gee = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id_gee, limit, ((page - 1) * limit)], function(error: any, results: any, fields: any){            
                res.json({records :results, total_items: count});
            });    
        });
    }

    public async listCardsRecords (req: Request, res: Response):  Promise<void>{
        const id_card: number = Number(req.params.id_card);
        const page: number = Number(req.params.page);
        const limit: number = Number(req.params.limit);
        await pool.query("SELECT count(*) as total_records FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id DESC;", [id_card], async (error: any, results: any, fields: any) => {            
            if(error) {
                console.log(error);
            }
            const count = results[0].total_records;
            await pool.query("SELECT * FROM tarjetas_registro WHERE id_tarjeta = ? ORDER BY id DESC LIMIT ? OFFSET ?;", [id_card, limit, ((page - 1) * limit)], function(error: any, results: any, fields: any){            
                res.json({records :results, total_items: count});
            });
        });
    }

    public async listCardsRecordsByDate (req: Request, res: Response):  Promise<void>{
        const id_card: number = Number(req.params.id_card);
        const fecha_inicial: string = req.params.fecha_inicial;
        const fecha_final: string = req.params.fecha_final;
        const query: string = "SELECT * FROM tarjetas_registro WHERE id_tarjeta = ? AND fecha >= ? AND fecha <= ? ORDER BY id ASC";
        await pool.query(query, [id_card, fecha_inicial, fecha_final], (error: any, results: any, fields: any) => {
            if(error) {
                console.log(error);
            }
            res.json(results);
        })
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

    public async createGRecord(req: Request, res: Response): Promise<void>{
        console.log(req.body);
        //let tank_records: any[] = [];
        for(let i = 0; i < req.body.length; i++) {
            req.body[i][6] = moment(req.body[i][6]).format('HH:mm');
            req.body[i][7] = moment(req.body[i][7]).format('HH:mm');
            /*let tank_record = [req.body[i][0], '20' + req.body[i][4] + '/' + req.body[i][3] + '/' + req.body[i][2], req.body[i][12], req.body[i][1]];
            tank_records.push(tank_record);*/
        }
        await pool.query('INSERT INTO gee_registro (id_gee, id_usuario, D, M, A, tipo, hora_inicial, hora_final, horametro_inicial, horametro_final, tiempo_trabajado, energia_generada, combustible_consumido, combustible_existencia, observaciones) VALUES ?', [req.body], function (error: any, results: any, fields: any){
            if (error) {
                console.log(error);
            }
            res.json({message: 'GEE Record saved'});
        });
    }

    public async createFCard(req: Request, res: Response): Promise<void> {
        delete req.body.id;
        const id_usuario = req.body.id_usuario;
        delete req.body.id_usuario;            // delete id_usuario from request to avoid circular reference when using the function later on.
        await pool.query('SELECT * FROM configuracion', async (error: any, configuracion: any, fields: any) =>{
            let precio_combustible = 0;
            if (req.body.tipo_combustible === 'Diesel Regular') {
                precio_combustible = configuracion[0].precio_dregular;
            } else if (req.body.tipo_combustible === 'Gasolina') {
                precio_combustible = configuracion[0].precio_gregular;
            }
            await pool.query('INSERT INTO tarjetas SET ?', [req.body],async function(error: any, results: any, fields: any) {
                if (error) {
                    console.log(error);
                }
                const newRecord = {
                    id_tarjeta: results.insertId, 		// insert id of new record in table "tarjetas"
                    id_gee: req.body.id_gee,			// id of gee
                    id_usuario: id_usuario,			// id of user who inserted the record
                    fecha: new Date(),		// date of record creation
                    sinicial_pesos: req.body.saldo,
                    sinicial_litros: geeController.round(req.body.saldo / precio_combustible, 2),	// round to 2 decimals, because the database only accepts numbers.
                    sfinal_pesos: req.body.saldo,
                    sfinal_litros: geeController.round(req.body.saldo / precio_combustible, 2),	// round to 2 decimals, because the database only accepts numbers.
                    observacion: 'Tarjeta agregada al registro.'
                };
                await pool.query('INSERT INTO tarjetas_registro SET ?', [newRecord], async (errors: any, result: any, fields:any) => {
                    if (errors) {
                        console.log(error);
                    }
                    res.json({message: 'FCard saved'});
                });
            });
        });
    }

    public async createCardRecord(req: Request, res: Response):  Promise<void>{
        delete req.body.id;
        delete req.body.precio_combustible;
        delete req.body.nombre_combustible;
        req.body.fecha = req.body.fecha.substring(0, req.body.fecha.indexOf('T'));
        //console.log(req.body);
        await pool.query('INSERT INTO tarjetas_registro SET ?', [req.body], async (errors: any, result: any, fields:any) => {
            res.json({message: 'FCard Record saved'});
        });
    }

    public async changeFuelPrice(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const newfuel = req.body.fuel;
        const prevprice = req.body.prevprice;
        const id_usuario: number = req.body.id_usuario;
        await pool.query("SELECT * FROM tarjetas WHERE tipo_combustible = ?;", [newfuel.id], async function(error: any, tarjetas: any, fields: any){            
            let new_records = [];
            for (let i = 0; i < tarjetas.length; i++) {
                let record: any = [
                    tarjetas[i].id,
                    tarjetas[i].id_gee,
                    id_usuario,
                    new Date(),
                    tarjetas[i].saldo,
                    geeController.round(tarjetas[i].saldo / prevprice, 2),
                    tarjetas[i].saldo,
                    geeController.round(tarjetas[i].saldo / newfuel.precio, 2), 	// Price after change,
                    'Cambio de precio del ' + newfuel.tipo_combustible + ' de ' + prevprice + ' a ' + newfuel.precio,
                ];
                new_records.push(record);
            }
            await pool.query('INSERT INTO tarjetas_registro(id_tarjeta, id_gee, id_usuario, fecha, sinicial_pesos, sinicial_litros, sfinal_pesos, sfinal_litros, observacion) VALUES ?', [new_records], async function (error: any, results: any, fields: any) {
                await pool.query('UPDATE tipos_combustibles SET ? WHERE id = ?', [newfuel, newfuel.id], function (error: any, result: any, fields: any) {
                    res.json({text:"Price updated"});
                });
            });
        });
    }

    public async adjustTankExistence(req: Request, res: Response): Promise<void> {
        req.body.existencia = Number(req.body.existencia);
        req.body.fecha = String(req.body.fecha).substring(0, 10);
        await pool.query('INSERT INTO gee_tanque SET ?', [req.body], function (error: any, result: any, fields: any) {
            if (error) {
                console.log(error);
            }
            res.json({message: 'GEETank fuel adjusted'});
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
        console.log(req.body);
        const result = pool.query('UPDATE gee set ? WHERE id = ?', [req.body,id], function(error: any, results: any, fields: any){            
            if (error) {
                console.log(error);
            }
            res.json({text:"Gee updated"});
        });
    }

    public async delete(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query('DELETE FROM gee WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"GEE deleted"});
        });        
    }

    public async deleteGEERecord(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query('DELETE FROM gee_registro WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"GEERecord deleted"});
        });        
    }

    public async deleteCardRecord(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query('DELETE FROM tarjetas_registro WHERE id = ?', [id], function(error: any, results: any, fields: any){            
            res.json({text:"CardRecord deleted"});
        });
    }

    public async deleteFuelCard(req: Request, res: Response):  Promise<void> {
        const {id} = req.params;            //id de la tarjeta a borrar.
        await pool.query('DELETE FROM tarjetas_registro WHERE id_tarjeta = ?', [id], async function(error: any, results: any, fields: any) {
            await pool.query('DELETE FROM tarjetas WHERE id = ?', [id], async function(error: any, results: any, fields: any) {
                res.json({text:"Card deleted"});
            });
        });
    }
}
const geeController = new GEEController();
export default geeController;