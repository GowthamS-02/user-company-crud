const nodemailer = require("nodemailer");

module.exports.emailNotification = async (emails, message) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_MAIL_ADDRESS,
            pass: process.env.NODEMAILER_MAIL_APP_PASS,
        },
    });

    var mailOptions = {
        from: {
            name: "User Notification",
            address: process.env.NODEMAILER_MAIL_ADDRESS,
        },
        to: emails,
        subject: "Sending Email for user notification",
        text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent Successfully!");
            console.log("Email response: " + info.response);
        }
    });
};
