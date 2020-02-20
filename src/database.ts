// import mysql from 'promise-mysql';
import {promisify} from 'util';
import keys from './keys';
var mysql = require('mysql');

const pool = mysql.createPool(keys.database);


pool.getConnection(function(err: any,connection: any){
    if (err) throw err;
    pool.releaseConnection(connection);
    console.log('BD connection started...');
});

pool.query = promisify(pool.query);
export default pool;    
