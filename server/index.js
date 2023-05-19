import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dptenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/auth.js';
import createPost from './controllers/createPost.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from "./data/index.js";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express()
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const uplaod = multer({ storage });

app.post('/auth/register', uplaod.single("picture"), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost)

// Routes
app.use('/auth', authRoutes);
app.use('/userRoutes', userRoutes);

// Mongoose
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((error) => console.log(`${error}`));