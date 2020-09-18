"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    database: {
        host: 'db4free.net',
        user: 'citmatel_root',
        password: 'Supernova*20',
        database: 'citmatel_lt',
        timezone: 'utc',
        port: '3306'
    },
    /*
    database:{
        host: 'localhost',
        user: 'root',
        password: 'Supernova*20',
        database: 'citmatel_lt',
        timezone: 'utc',
        // port: '3306'
    },*/
    mail_server: {
        host: "webmail.lastunas.cu",
        port: 25,
        secure: false,
        auth: {
            user: 'carlos',
            pass: 'David.18'
        },
        tls: {
            rejectUnauthorized: false
        }
    }
};
