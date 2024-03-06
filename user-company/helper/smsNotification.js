const { number } = require("joi");
const twilio = require("twilio");

module.exports.smsNotification = async (ph_number, message) => {
    const client = new twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    return ph_number.forEach((number) => {
        client.messages
            .create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: number,
            })
            .then((message) => {
                console.log(message, "Message Sent");
            })
            .catch((err) => {
                console.log(err, "Message not sent");
            });
    });
};
