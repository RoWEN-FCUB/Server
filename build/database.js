"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mysql from 'promise-mysql';
const util_1 = require("util");
const keys_1 = __importDefault(require("./keys"));
var mysql = require('mysql');
const pool = mysql.createPool(keys_1.default.database);
pool.getConnection(function (err, connection) {
    if (err)
        throw err;
    pool.releaseConnection(connection);
    console.log('BD connection started...');
});
pool.query = util_1.promisify(pool.query);
exports.default = pool;
