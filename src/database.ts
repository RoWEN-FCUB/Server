// import mysql from 'promise-mysql';
import {promisify} from 'util';
import keys from './keys';
var mysql = require('mysql');

const pool = mysql.createPool(keys.database);


const attemptConnection = () => pool.getConnection(function(err: any,connection: any){
    if (err) {
        console.log('Error connecting to database. retrying in 5 sec');
        console.log(err);
        setTimeout(attemptConnection, 5000);
    }  else {
        pool.releaseConnection(connection);
        console.log('Database connection started...');
    }
});

pool.query = promisify(pool.query);
export default pool;
attemptConnection();
