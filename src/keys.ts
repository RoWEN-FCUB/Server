export default{
    database:{
        host: 'localhost',
        user: 'root',
        password: 'Admin123',
        database: 'citmatel_lt',
        timezone: 'utc'
    },
    mail_server: {
        host: "webmail.lastunas.cu",
        port: 25, //587
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'carlos',
            pass: 'David.18'
        },
        tls: {
            rejectUnauthorized: false
        }
    }
}
