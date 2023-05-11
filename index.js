import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import cors from "cors";
import multer from 'multer';
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = 1987;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Database Connected!!");
})

app.use("/images", express.static(path.join(__dirname, "public/images")))

// middleware
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/post/");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File Uploaded successfully");
    }catch (err) {
        console.log(err);
    }
});

app.use('/api/users', userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})