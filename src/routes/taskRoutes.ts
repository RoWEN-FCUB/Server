import { Router } from 'express';
import taskController from '../controllers/taskController';

class TaskRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/:id', taskController.list); // obtener todas las tareas del usuario id
        this.router.get('/st', taskController.getStates); // obtener los estados de las tareas
        this.router.get('/get/:id', taskController.getOne); // obtener la tarea especificada id
        this.router.get('/taskofday/:id&:day', taskController.getTaskofDay)// obtener todas las tareas del dia del usuario
        this.router.get('/tasksinrange/:id&:dia_inicio&:dia_fin', taskController.getRangeofTasks) // obtener las tareas en el rango dado
        this.router.get('/count/:id&:day&:state', taskController.countTaskofDay); // contar las tareas con el estado dado
        this.router.get('/obs/:id', taskController.task_Observations);// obtener las observaciones de una tarea
        this.router.post('/obs', taskController.createObserv);// guardar observacion
        this.router.post('/', taskController.create);// guardar
        this.router.post('/copy', taskController.copy);//copiar tareas
        this.router.put('/:id', taskController.update);// actualizar
        this.router.delete('/:id', taskController.delete);// eliminar
    }
}
const taskRoutes = new TaskRoutes();
export default taskRoutes.router;