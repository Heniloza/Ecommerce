const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
const { Readable } = require('stream');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
    secure: true, 
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function imageUploadUtils(fileBuffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); 

        readableStream.pipe(uploadStream);
    });
}

module.exports = { imageUploadUtils, upload };