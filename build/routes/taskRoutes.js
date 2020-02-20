"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
class TaskRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id', taskController_1.default.list); // obtener todas las tareas del usuario id
        this.router.get('/st', taskController_1.default.getStates); // obtener los estados de las tareas
        this.router.get('/get/:id', taskController_1.default.getOne); // obtener la tarea especificada id
        this.router.get('/taskofday/:id&:day', taskController_1.default.getTaskofDay); // obtener todas las tareas del dia del usuario
        this.router.get('/tasksinrange/:id&:dia_inicio&:dia_fin', taskController_1.default.getRangeofTasks); // obtener las tareas en el rango dado
        this.router.get('/count/:id&:day&:state', taskController_1.default.countTaskofDay); // contar las tareas con el estado dado
        this.router.get('/obs/:id', taskController_1.default.task_Observations); // obtener las observaciones de una tarea
        this.router.post('/obs', taskController_1.default.createObserv); // guardar observacion
        this.router.post('/', taskController_1.default.create); // guardar
        this.router.post('/copy', taskController_1.default.copy); //copiar tareas
        this.router.put('/:id', taskController_1.default.update); // actualizar
        this.router.delete('/:id', taskController_1.default.delete); // eliminar
    }
}
const taskRoutes = new TaskRoutes();
exports.default = taskRoutes.router;
