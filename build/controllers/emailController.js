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
const nodemailer = require("nodemailer");
function SendEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer.createTransport({
            host: "169.158.143.131",
            port: 25,
            secure: false,
            auth: {
                user: 'carlos',
                pass: 'David.18'
            }
        });
        /*
        let info = await transporter.sendMail({
            from: '"Carlos" <carlos@ltunas.inf.cu>', // sender address
            to: "carlos@ltunas.inf.cu", // list of receivers
            subject: "Hello ", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>" // html body
        });*/
    });
}
