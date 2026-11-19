import nodemailer from "nodemailer";
import "dotenv/config";

// Le "transporteur" : la connexion au serveur SMTP (Gmail)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // port 587 : la connexion devient chiffrée après coup (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Envoie un e-mail texte simple
async function sendMail(to, subject, text) {
    return transporter.sendMail({
        from: `"CineHub" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text
    });
}

export default sendMail;
