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
Object.defineProperty(exports, "__esModule", { value: true });
// var moment = require('moment');
var fetch = require('node-fetch');
class DeliverController {
    constructor() { }
    getRemoteDeliver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const params = new URLSearchParams();
            params.append('auth_login', 'yaro');
            params.append('auth_password', 'yaro.2021');
            const url = 'http://mall.cuba.cu/backend/index.php';
            const url2 = 'http://mall.cuba.cu/backend/pedido.php?action=DgJson&page=1&sortField=1&sortOrder=asc&show=10&filtroPedidoCodigoDesde=' + code + '&filtroPedidoCodigoHasta=' + code;
            const response = yield fetch(url, {
                method: 'POST',
                body: params,
                headers: { 'Connection': "keep-alive" }
            }).then((res0) => {
                const response2 = fetch(url2, { method: 'GET', headers: { 'Cookie': res0.headers.raw()['set-cookie'][0].substr(0, res0.headers.raw()['set-cookie'][0].indexOf(";")) } }).then((res01) => res01.json()).then((text) => {
                    // console.log(text['rows']);
                    res.json(text['rows']);
                });
            });
        });
    }
}
const deliverController = new DeliverController();
exports.default = deliverController;
