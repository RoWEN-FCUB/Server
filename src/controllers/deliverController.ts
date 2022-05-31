import { Request, Response } from 'express';
import * as fs from 'fs';
import Path from 'path';
// var moment = require('moment');
var fetch = require('node-fetch');
import pool from '../database';

class DeliverController {
    constructor() {}

    public async getRemoteDeliver (req: Request, res: Response): Promise<void>{
        const {code} = req.params;
        const params = new URLSearchParams();
        params.append('auth_login', 'yaro');
        params.append('auth_password', 'yaro.2021');
        const url = 'http://mall.cuba.cu/backend/index.php';
        const url2 = 'http://mall.cuba.cu/backend/pedido.php?action=DgJson&page=1&sortField=1&sortOrder=asc&show=10&filtroPedidoCodigoDesde='+ code +'&filtroPedidoCodigoHasta=' + code;
        const response = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {'Connection': "keep-alive"}
        }).then((res0: any) => {
            const response2 = fetch(url2, {method: 'GET', headers: {'Cookie': res0.headers.raw()['set-cookie'][0].substr(0, res0.headers.raw()['set-cookie'][0].indexOf(";"))}}).then(
                (res01: any) => res01.json()
            ).then((text:any) => {
                // console.log(text['rows']);
                res.json(text['rows']);
            });
        }).catch((error: any) => {
            console.log(error);
            res.status(404).json({text: 'Error al contactar con el servidor'});
        });
    }

    public async saveDeliver (req: Request, res: Response): Promise<void>{
        const code = req.body.code;
        const img64 = req.body.img;
        const id_user = req.body.id_user;
        delete req.body.img;
        let buff = Buffer.from(img64, 'base64');
        let fullpath = Path.join(process.cwd(), 'public', 'Vales', code + '.png');
        const isExtendedLengthPath = /^\\\\\?\\/.test(fullpath);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(fullpath); // eslint-disable-line no-control-regex
        if (!isExtendedLengthPath && !hasNonAscii) {
            fullpath = fullpath.replace(/\\/g, '/');
        }
        try {
            if (!fs.existsSync(fullpath)) {
                fs.writeFileSync(fullpath, buff);
                await pool.query('INSERT INTO registro_vale SET ?', [req.body], function(error: any, results: any, fields: any) {
                    res.json({text: 'Vale guardado'});
                });
            } else {
                res.status(404).json({text: 'El vale ya existe.'});
            }
        } catch(err) {
            console.log(err);
            res.status(404).json({text: 'Se produjo un error al intentar guardar el vale.'});
        }        
    }
}
const deliverController = new DeliverController();
export default deliverController;