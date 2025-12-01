import cloudinary from "../utils/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("cover");

export async function uploadToCloudinary(req, res, next) {
    upload(req, res, async function (error) {
        if (error) return res.status(400).json({ error: error.message });
        if (!req.file) return res.status(400).json({ error: "No cover file provided" });

        const allowTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
        if (!allowTypes.includes(req.file.mimetype))
            return res.status(400).json({ error: "Invalid image type" });

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "blog_covers" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            req.body.cover = result.secure_url;

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Cloudinary upload failed" });
        }
    });
}
