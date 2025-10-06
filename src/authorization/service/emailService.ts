import nodemailer from "nodemailer";


export const emailService = {

    async sendRegistrationEmail(email: string, code: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "lalal@gmail.com",
                pass: "lalalaa"
            },
        });

        const html = `
<h1>Здравствуйте!</h1>
<p>Вы зарегистрировались в сервисе MyApp.</p>
<p>Ваш код подтверждения: <b>${code}</b></p>
<p>Или просто перейдите по ссылке:</p>
<a href="https://some-front.com/confirm-registration?code=${code}">Подтвердить регистрацию</a>
<p>Если вы не регистрировались — проигнорируйте это письмо.</p>
`;

        await transporter.sendMail({
            from: `"MyApp" <mixailmar4uk78@gmail.com>`,
            to: email,
            subject: "Confirm your registration",
            text: `Здравствуйте! Вы зарегистрировались в MyApp.
            Ваш код подтверждения: ${code}.
            Или перейдите по ссылке: https://ya.ru/?code=${code}
            Если это были не вы — просто игнорируйте письмо.`,
            html
        });

        return true;
    }
};