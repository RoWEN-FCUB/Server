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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// var moment = require('moment');
var fetch = require('node-fetch');
const database_1 = __importDefault(require("../database"));
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
            }).catch((error) => {
                console.log(error);
                res.status(404).json({ text: 'Error al contactar con el servidor' });
            });
        });
    }
    saveDeliver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const img64 = req.body.img;
            const id_user = req.body.id_user;
            delete req.body.img;
            let buff = Buffer.from(img64, 'base64');
            let fullpath = path_1.default.join(process.cwd(), 'public', 'Vales', code + '.png');
            const isExtendedLengthPath = /^\\\\\?\\/.test(fullpath);
            const hasNonAscii = /[^\u0000-\u0080]+/.test(fullpath); // eslint-disable-line no-control-regex
            if (!isExtendedLengthPath && !hasNonAscii) {
                fullpath = fullpath.replace(/\\/g, '/');
            }
            try {
                if (!fs.existsSync(fullpath)) {
                    fs.writeFileSync(fullpath, buff);
                    yield database_1.default.query('INSERT INTO registro_vale SET ?', [req.body], function (error, results, fields) {
                        res.json({ text: 'Vale guardado' });
                    });
                }
                else {
                    res.status(404).json({ text: 'El vale ya existe.' });
                }
            }
            catch (err) {
                console.log(err);
                res.status(404).json({ text: 'Se produjo un error al intentar guardar el vale.' });
            }
        });
    }
}
const deliverController = new DeliverController();
exports.default = deliverController;
