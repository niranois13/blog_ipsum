import cloudinary from "../utils/cloudinary.cjs";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single("cover");

export async function uploadToCloudinary(req, res, next) {
    upload(req, res, async (error) => {
        if (error) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ error: "File too large. Max 10 MB allowed." });
            }
            return res.status(400).json({ error: error.message });
        }

        // Pas de fichier, passer au prochain middleware
        if (!req.file) return next();

        // Vérifier le type MIME
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid image type" });
        }

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "blog_covers",
                        transformation: [
                            { width: 1200, crop: "limit" },
                            { fetch_format: "auto", quality: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            req.body.coverID = result.public_id;

            next();
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Cloudinary upload failed" });
        }
    });
}
