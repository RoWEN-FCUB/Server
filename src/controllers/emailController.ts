const nodemailer = require("nodemailer");

async function SendEmail() {
    let transporter = nodemailer.createTransport({
        host: "169.158.143.131",
        port: 25, //587
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'carlos',
          pass: 'David.18'
        }
      });
    
    let info = await transporter.sendMail({
        from: '"Carlos" <carlos@ltunas.inf.cu>', // sender address
        to: "carlos@ltunas.inf.cu", // list of receivers
        subject: "Hello ", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });
}

