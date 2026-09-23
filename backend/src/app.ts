import express from 'express';
import cors from 'cors';
import routes from "./routes/index.js";
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://uva-desenvolvimento-back-end-ava2.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true
}));

app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;