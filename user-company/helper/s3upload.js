const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
// require("dotenv").config();

module.exports.uploadImage = async (data) => {
    // AWS.config.update({
    //     accessKeyId: process.env.ACCESS_KEY,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
    //     region: "ap-south-1",
    // });
    const s3 = new AWS.S3();
    const imageBuffer = Buffer.from(data, "base64");
    function generateRandomString(length) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }
    function generateRandomImageName() {
        const timestamp = new Date().getTime();
        const randomString = generateRandomString(5);
        return `${timestamp}_${randomString}.jpg`;
    }

    const uploadParams = {
        Bucket: "user-company-demo2",
        Key: generateRandomImageName(),
        Body: imageBuffer,
        ContentType: "image/jpeg",
        ACL: "public-read",
    };

    let imageUrl = () => {
        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, async (err, data) => {
                if (err) {
                    console.error("Error uploading image:", err);
                    reject(err); 
                } else {
                    const picUrl = data.Location;
                    console.log("Image uploaded successfully. Image URL:", picUrl);
                    resolve(picUrl); 
                }
            });
        });
    };

   let urlImage = await imageUrl();
   return urlImage;
};
