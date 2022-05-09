import { Request, Response } from 'express';
// var moment = require('moment');
var fetch = require('node-fetch');

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
        });
    }
}
const deliverController = new DeliverController();
export default deliverController;