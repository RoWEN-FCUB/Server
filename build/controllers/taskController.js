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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
var moment = require('moment');
const usersController_1 = __importDefault(require("./usersController"));
class TaskController {
    constructor() { }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tasks = yield database_1.default.query("SELECT tareas.*, GROUP_CONCAT(observaciones_tareas.observacion ORDER BY observaciones_tareas.id SEPARATOR '_') AS observaciones FROM tareas LEFT JOIN observaciones_tareas ON (tareas.id=observaciones_tareas.id_tarea) WHERE tareas.id_usuario = ? GROUP BY tareas.id;", [id], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getTaskofDay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { day } = req.params;
            const tasks = yield database_1.default.query("SELECT tareas.*, GROUP_CONCAT(observaciones_tareas.observacion ORDER BY observaciones_tareas.id SEPARATOR '_') AS observaciones, users.user AS nombre_creador FROM tareas INNER JOIN users ON(tareas.id_creador=users.id) LEFT JOIN observaciones_tareas ON (tareas.id=observaciones_tareas.id_tarea) WHERE tareas.id_usuario = ? AND (? BETWEEN DATE(tareas.fecha_inicio) AND DATE(tareas.fecha_fin)) GROUP BY tareas.id ORDER BY TIME(tareas.fecha_inicio);", [id, day], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getRangeofTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { dia_inicio } = req.params;
            const { dia_fin } = req.params;
            // console.log("SELECT tareas.*, GROUP_CONCAT(observaciones_tareas.observacion ORDER BY observaciones_tareas.id SEPARATOR '_') AS observaciones, users.user AS nombre_creador FROM tareas INNER JOIN users ON(tareas.id_creador=users.id) LEFT JOIN observaciones_tareas ON (tareas.id=observaciones_tareas.id_tarea) WHERE tareas.id_usuario = "+id+" AND ((DATE(tareas.fecha_inicio) BETWEEN "+dia_inicio+" AND "+dia_fin+") OR (DATE(tareas.fecha_fin) BETWEEN "+dia_inicio+" AND "+dia_fin+")) GROUP BY tareas.id ORDER BY tareas.fecha_inicio;");          
            const tasks = yield database_1.default.query("SELECT tareas.*, GROUP_CONCAT(observaciones_tareas.observacion ORDER BY observaciones_tareas.id SEPARATOR '_') AS observaciones, users.user AS nombre_creador FROM tareas INNER JOIN users ON(tareas.id_creador=users.id) LEFT JOIN observaciones_tareas ON (tareas.id=observaciones_tareas.id_tarea) WHERE tareas.id_usuario = ? AND ((DATE(tareas.fecha_inicio) BETWEEN ? AND ?) OR (DATE(tareas.fecha_fin) BETWEEN ? AND ?) OR (? BETWEEN DATE(tareas.fecha_inicio) AND DATE(tareas.fecha_fin))) GROUP BY tareas.id ORDER BY tareas.fecha_inicio;", [id, dia_inicio, dia_fin, dia_inicio, dia_fin, dia_inicio], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    countTaskofDay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { day } = req.params;
            const { state } = req.params;
            //console.log(req.params);       
            const tasks = yield database_1.default.query("SELECT COUNT(tareas.id) AS cantidad FROM tareas WHERE tareas.id_usuario = ? AND tareas.fecha LIKE ? AND tareas.estado = ?;", [id, '' + day + '%', '' + state + ''], function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getStates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield database_1.default.query("SELECT * FROM estados_tareas;", function (error, results, fields) {
                res.json(results);
            });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const task = yield database_1.default.query('SELECT * FROM tareas WHERE id = ?', [id], function (error, results, fields) {
                if (results.length > 0)
                    res.json(results[0]);
                else
                    res.json({ text: "Task not found" });
            });
        });
    }
    task_Observations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const task_ob = yield database_1.default.query('SELECT observacion FROM observaciones_tareas WHERE id_tarea = ?', [id], function (error, results, fields) {
                if (results.length > 0)
                    res.json(results);
                else
                    res.json({ text: "Task observations not found" });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = req.body.task;
            const subs = req.body.subs;
            // const id = task.id;
            const creador = task.nombre_creador;
            // console.log(req.body);
            delete task.id;
            delete task.observaciones;
            delete task.nombre_creador;
            task.estado = 'Pendiente';
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            task.fecha_inicio = task.fecha_inicio.replace('T', ' ');
            task.fecha_inicio = task.fecha_inicio.replace('.000Z', '.000');
            task.fecha_fin = task.fecha_fin.replace('T', ' ');
            task.fecha_fin = task.fecha_fin.replace('.000Z', '.000');
            newDate.setHours(hours - offset);
            let new_tasks = [];
            let notificaciones = [];
            for (let i = 0; i < subs.length; i++) {
                task.id_usuario = subs[i];
                new_tasks.push(Object.values(task));
                let notificacion = {
                    id_usuario: task.id_usuario,
                    notificacion: '<b>' + creador + '</b> te ha asignado la tarea: <b>' + task.resumen + '</b>',
                    fecha: newDate,
                    leida: false,
                    vinculo: 'tasks/' + task.id_usuario + '/' + task.fecha_inicio + '/' + task.fecha_fin,
                    estatus: 'info',
                };
                if (task.id_usuario !== task.id_creador) {
                    notificaciones.push(Object.values(notificacion));
                }
            }
            yield database_1.default.query('INSERT INTO tareas (id_usuario, resumen, descripcion, fecha_inicio, estado, id_creador, duracion, validada, fecha_fin) VALUES ?', [new_tasks], function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.json({ text: 'Task saved' });
                    }
                    if (notificaciones.length > 0) {
                        yield database_1.default.query('INSERT INTO notificaciones (id_usuario, notificacion, fecha, leida, vinculo, estatus) VALUES ?', [notificaciones], function (error, results, fields) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        });
                    }
                });
            });
        });
    }
    validateAllTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userid = req.body.userid;
            let startD = req.body.startD;
            let endD = req.body.endD;
            const inicio = startD;
            const fin = endD;
            startD = startD.substr(0, startD.indexOf('T'));
            endD = endD.substr(0, endD.indexOf('T'));
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            newDate.setHours(hours - offset);
            let query = 'UPDATE tareas SET validada=true WHERE tareas.id_usuario = ' + userid + ' AND ((DATE(tareas.fecha_inicio) BETWEEN \'' + startD + '\' AND \'' + endD + '\') OR (DATE(tareas.fecha_fin) BETWEEN \'' + startD + '\' AND \'' + endD + '\'));';
            // console.log(query);
            const tasktovalidate = yield database_1.default.query(query, function (error, results, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log(error);
                    }
                    query = 'SELECT user FROM `users` WHERE id = (SELECT id_sup FROM users WHERE id = ' + userid + ')';
                    const superior = yield database_1.default.query(query, function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let notificacion = {
                                id_usuario: userid,
                                notificacion: '<b>' + results[0].user + '</b> ha validado tus tareas del <b>' + startD + '</b> al <b>' + endD + '</b>',
                                fecha: newDate,
                                leida: false,
                                vinculo: 'tasks/' + userid + '/' + inicio + '/' + fin,
                                estatus: 'info',
                            };
                            yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                                // res.json({text: 'Task copied'});
                            });
                        });
                    });
                    res.json({ text: 'Tasks validated' });
                });
            });
        });
    }
    copy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            let startD = req.body.startD;
            const endD = req.body.endD;
            let new_tasks = [];
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            newDate.setHours(hours - offset);
            const tasktocopy = yield database_1.default.query('SELECT tareas.*, users.user AS nombre_creador FROM tareas INNER JOIN users ON(tareas.id_creador=users.id) WHERE tareas.id = ?', id, function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                if (results[0]) {
                    delete results[0].id;
                    results[0].estado = 'Pendiente';
                    results[0].validada = false;
                    const creador = results[0].nombre_creador;
                    delete results[0].nombre_creador;
                    startD = new Date(startD);
                    results[0].fecha_inicio = moment.utc(results[0].fecha_inicio).dayOfYear(moment(startD).dayOfYear()).toDate();
                    results[0].fecha_fin = results[0].fecha_inicio;
                    const id_usuario = results[0].id_usuario;
                    const resumen = results[0].resumen;
                    const id_creador = results[0].id_creador;
                    do {
                        new_tasks.push(Object.values(results[0])); //copiar el objeto como un arreglo de valores
                        results[0].fecha_inicio = moment(results[0].fecha_inicio).add(1, 'days').toDate();
                        results[0].fecha_fin = results[0].fecha_inicio;
                    } while (!moment(results[0].fecha_inicio).isAfter(endD, 'day'));
                    console.log(new_tasks);
                    const sqlquery = 'INSERT INTO tareas (id_usuario, resumen, descripcion, fecha_inicio, estado, id_creador, duracion, validada, fecha_fin) VALUES ?';
                    const copyingtask = database_1.default.query(sqlquery, [new_tasks], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            if (id_usuario !== id_creador) {
                                let notificacion = {
                                    id_usuario: id_usuario,
                                    notificacion: '<b>' + creador + '</b> te ha asignado la tarea: <b>' + resumen + '</b>',
                                    fecha: newDate,
                                    leida: false,
                                    vinculo: 'tasks/' + id_usuario + '/' + new_tasks[0][3] + '/' + new_tasks[new_tasks.length - 1][8],
                                    estatus: 'info',
                                };
                                yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                                    res.json({ text: 'Task copied' });
                                });
                            }
                            res.json({ text: 'Task copied' });
                        }
                    }));
                }
            });
        });
    }
    createObserv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO observaciones_tareas set ?', [req.body], function (error, results, fields) {
                res.json({ text: 'Observation saved' });
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            delete req.body.observaciones;
            delete req.body.nombre_creador;
            let task = {};
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            req.body.fecha_inicio = req.body.fecha_inicio.replace('T', ' ');
            req.body.fecha_inicio = req.body.fecha_inicio.replace('.000Z', '.000');
            req.body.fecha_fin = req.body.fecha_fin.replace('T', ' ');
            req.body.fecha_fin = req.body.fecha_fin.replace('.000Z', '.000');
            //console.log(req.body);
            newDate.setHours(hours - offset);
            const tsk = yield database_1.default.query('SELECT * FROM tareas INNER JOIN users ON (tareas.id_usuario = users.id) WHERE tareas.id = ?', [id], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                task = results[0];
                if (error) {
                    console.log(error);
                }
                let status = '';
                let msg = '';
                if (req.body.estado === 'Cumplida') {
                    status = 'success';
                    msg = 'completado';
                }
                else if (req.body.estado === 'Cancelada') {
                    status = 'warning';
                    msg = 'cancelado';
                }
                else if (req.body.estado === 'Pendiente') {
                    status = 'info';
                    msg = 'pospuesto';
                }
                if (task.id_usuario !== task.id_sup) {
                    let notificacion = {
                        id_usuario: task.id_sup,
                        notificacion: '<b>' + task.user + '</b> ha ' + msg + ': <b>' + task.resumen + '</b>',
                        fecha: newDate,
                        leida: false,
                        vinculo: 'tasks/' + task.id_usuario + '/' + task.fecha_inicio + '/' + task.fecha_fin,
                        estatus: status,
                    };
                    const notif = yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            yield database_1.default.query('UPDATE tareas set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (error) {
                                        console.log(error);
                                    }
                                    if (!task.validada && req.body.validada) {
                                        let query = 'SELECT user FROM `users` WHERE id = (SELECT id_sup FROM users WHERE id = ' + task.id_usuario + ')';
                                        const superior = yield database_1.default.query(query, function (error, results, fields) {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                if (error) {
                                                    console.log(error);
                                                }
                                                let notificacion = {
                                                    id_usuario: task.id_usuario,
                                                    notificacion: '<b>' + results[0].user + '</b> ha validado tu tarea <b>' + task.resumen + '</b>',
                                                    fecha: newDate,
                                                    leida: false,
                                                    vinculo: 'tasks/' + task.id_usuario + '/' + task.fecha_inicio + '/' + task.fecha_inicio,
                                                    estatus: 'info',
                                                };
                                                yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                                                    if (error) {
                                                        console.log(error);
                                                    }
                                                    res.json({ text: "Task updated" });
                                                });
                                            });
                                        });
                                    }
                                    res.json({ text: "Task updated" });
                                });
                            });
                        });
                    });
                }
                else {
                    yield database_1.default.query('UPDATE tareas set ? WHERE id = ?', [req.body, id], function (error, results, fields) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            if (!task.validada && req.body.validada) {
                                let query = 'SELECT user FROM `users` WHERE id = (SELECT id_sup FROM users WHERE id = ' + task.id_usuario + ')';
                                const superior = yield database_1.default.query(query, function (error, results, fields) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (error) {
                                            console.log(error);
                                        }
                                        let notificacion = {
                                            id_usuario: task.id_usuario,
                                            notificacion: '<b>' + results[0].user + '</b> ha validado tu tarea <b>' + task.resumen + '</b>',
                                            fecha: newDate,
                                            leida: false,
                                            vinculo: 'tasks/' + task.id_usuario + '/' + task.fecha_inicio + '/' + task.fecha_inicio,
                                            estatus: 'info',
                                        };
                                        yield database_1.default.query('INSERT INTO notificaciones set ?', [notificacion], function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                            }
                                            res.json({ text: "Task updated" });
                                        });
                                    });
                                });
                            }
                            res.json({ text: "Task updated" });
                        });
                    });
                }
            }));
        });
    }
    convertUTCDateToLocalDate(date) {
        const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        const offset = date.getTimezoneOffset() / 60;
        const hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const task = yield database_1.default.query('DELETE FROM tareas WHERE id = ?', [id], function (error, results, fields) {
                res.json({ text: "Task deleted" });
            });
        });
    }
    search_failed_tasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const actual_date = moment().toDate();
            const date = new Date();
            const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            const offset = date.getTimezoneOffset() / 60;
            const hours = date.getHours();
            newDate.setHours(hours - offset);
            yield database_1.default.query('SELECT * FROM tareas INNER JOIN users ON (tareas.id_usuario = users.id) WHERE tareas.estado = ? AND DATE(fecha_fin) < DATE(?)', ['Pendiente', actual_date], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                //console.log(results);
                if (results) {
                    let notificaciones = [];
                    for (let i = 0; i < results.length; i++) {
                        let notificacion = {
                            id_usuario: results[i].id_usuario,
                            notificacion: 'Tarea incumplida: <b>' + results[i].resumen + '</b>',
                            fecha: newDate,
                            leida: false,
                            vinculo: 'tasks/' + results[i].id_usuario + '/' + results[i].fecha_inicio + '/' + results[i].fecha_fin,
                            estatus: 'danger',
                        };
                        notificaciones.push(Object.values(notificacion));
                        if (results[i].id_usuario !== results[i].id_sup) {
                            notificacion = {
                                id_usuario: results[i].id_sup,
                                notificacion: '<b>' + results[i].user + '</b> incumplió la tarea : <b>' + results[i].resumen + '</b>',
                                fecha: newDate,
                                leida: false,
                                vinculo: 'tasks/' + results[i].id_usuario + '/' + results[i].fecha_inicio + '/' + results[i].fecha_fin,
                                estatus: 'danger',
                            };
                            notificaciones.push(Object.values(notificacion));
                        }
                    }
                    console.log('Generando ' + notificaciones.length + ' notificaciones');
                    if (notificaciones.length > 0) {
                        yield database_1.default.query('INSERT INTO notificaciones (id_usuario, notificacion, fecha, leida, vinculo, estatus) VALUES ?', [notificaciones], function (error, results, fields) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    console.log(error);
                                }
                                yield database_1.default.query('UPDATE tareas SET ? WHERE tareas.estado = ? AND DATE(fecha_fin) < DATE(?)', [{ estado: 'Incumplida' }, 'Pendiente', actual_date], function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                            });
                        });
                    }
                }
            }));
        });
    }
    send_Tasks() {
        return __awaiter(this, void 0, void 0, function* () {
            // REVISAR SI YA SE ENVIARON LAS TAREAS
            yield database_1.default.query('SELECT * FROM configuracion', (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                if (results[0]) {
                    const hoy = moment.utc().toDate();
                    //console.log(hoy);
                    //console.log(results[0].dia_actual);
                    if (!moment(results[0].dia_actual).isSame(hoy, 'day')) {
                        //console.log('los dias no coinciden');
                        //usersController.SendEmail('carlos@ltunas.inf.cu', 'probando', 'esto es una prueba de correo');
                        yield database_1.default.query("SELECT tareas.*, users.email as email, users.user AS nombre_creador FROM tareas INNER JOIN users ON(tareas.id_usuario=users.id) WHERE (DATE(?) BETWEEN DATE(tareas.fecha_inicio) AND DATE(tareas.fecha_fin)) ORDER BY tareas.id_usuario, TIME(tareas.fecha_inicio);", [hoy], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            if (results.length > 0) {
                                console.log('Enviando las tareas del día...');
                                let id_usuario = results[0].id_usuario;
                                let body = '<b>Hola ' + results[0].nombre_creador + ', estas son las tareas de hoy:</b><br> ';
                                body += '<table border="1"><tr><td><b>HORA</b></td><td><b>TAREAS</b></td></tr>';
                                body += '<tr><td>' + this.formatTime(results[0].fecha_inicio, results[0].duracion) + '</td>';
                                body += '<td>' + results[0].resumen + '</td></tr>';
                                for (let i = 1; i < results.length; i++) {
                                    if (results[i].id_usuario !== id_usuario) {
                                        id_usuario = results[i].id_usuario;
                                        body += '</table>';
                                        usersController_1.default.SendEmail(results[i - 1].email, 'Tareas de hoy', body);
                                        body = '<b>Hola ' + results[i].nombre_creador + ', estas son las tareas de hoy:</b><br> ';
                                        body += '<table border="1"><tr><td><b>HORA</b></td><td><b>TAREAS</b></td></tr>';
                                        body += '<tr><td>' + this.formatTime(results[i].fecha_inicio, results[i].duracion) + '</td>';
                                        body += '<td>' + results[i].resumen + '</td></tr>';
                                    }
                                    else {
                                        body += '<tr><td>' + this.formatTime(results[i].fecha_inicio, results[i].duracion) + '</td>';
                                        body += '<td>' + results[i].resumen + '</td></tr>';
                                    }
                                    if (i === results.length - 1) {
                                        body += '</table>';
                                        usersController_1.default.SendEmail(results[i].email, 'Tareas de hoy', body);
                                    }
                                }
                                yield database_1.default.query('UPDATE configuracion SET dia_actual = ?', [hoy], (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                                    if (error) {
                                        console.log(error);
                                    }
                                    console.log('Actualizado el dia');
                                }));
                                //console.log(body);
                            }
                        }));
                    }
                    else {
                        //console.log('los dias si coinciden');
                    }
                }
            }));
        });
    }
    formatTime(value, duration) {
        const duracion = moment.utc(value).add(duration, 'minutes').format('LT');
        const hora = moment.utc(value).format('LT');
        return hora + ' - ' + duracion;
    }
}
const taskController = new TaskController();
exports.default = taskController;
