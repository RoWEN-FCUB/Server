"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workshopController_1 = __importDefault(require("../controllers/workshopController"));
class WorkshopRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/records/:page&:id_emp', workshopController_1.default.listAll);
        this.router.get('/clients', workshopController_1.default.listClients);
        this.router.get('/devices', workshopController_1.default.listDevices);
        this.router.get('/marcs/:equipo', workshopController_1.default.listMarcs);
        this.router.get('/partmarcs/:part', workshopController_1.default.listPartMarcs);
        this.router.get('/partcaps/:part', workshopController_1.default.listPartCaps);
        this.router.get('/partmodels/:part&:marc', workshopController_1.default.listPartModels);
        this.router.get('/models/:equipo&:marca', workshopController_1.default.listModels);
        this.router.get('/serials/:equipo&:marca&:modelo', workshopController_1.default.listSerialsInv);
        this.router.get('/names/:id_cliente', workshopController_1.default.listNames);
        this.router.get('/listperson/:name', workshopController_1.default.listPerson);
        this.router.get('/parts/:id_reg', workshopController_1.default.listParts);
        this.router.get('/allparts', workshopController_1.default.listAllParts);
        this.router.post('/', workshopController_1.default.create);
        this.router.post('/createwperson', workshopController_1.default.createWPerson);
        this.router.get('/search/:str&:page&:id_emp', workshopController_1.default.search);
        this.router.put('/:id', workshopController_1.default.update);
        this.router.post('/updateparts', workshopController_1.default.updateParts);
        this.router.delete('/:id', workshopController_1.default.delete);
        this.router.delete('/parts/:id', workshopController_1.default.deletePart);
        this.router.delete('/wclient/:id', workshopController_1.default.deleteWCLient);
        this.router.delete('/wperson/:id', workshopController_1.default.deleteWPerson);
        this.router.delete('/wdevice/:wdev', workshopController_1.default.deleteWDevice);
    }
}
const workshopRoutes = new WorkshopRoutes();
exports.default = workshopRoutes.router;
