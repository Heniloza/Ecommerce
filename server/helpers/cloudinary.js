const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
    secure: true,
});

// ✅ Fix: Use multer with memory storage to process files correctly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Fix: Ensure image buffer is handled properly
async function imageUploadUtils(file) {
    try {
        if (!file || !file.buffer) {
            throw new Error("No file buffer found");
        }

        console.log("Uploading image...");

        // ✅ Convert buffer to Base64
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        // ✅ Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "ecommerce",
            format: "jpg", // ✅ Convert all images to JPG format
            allowed_formats: ["jpg", "png", "jpeg", "webp"], // ✅ Restrict formats
        });

        console.log("Image uploaded successfully:", result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Image upload failed");
    }
}

module.exports = { imageUploadUtils, upload };
