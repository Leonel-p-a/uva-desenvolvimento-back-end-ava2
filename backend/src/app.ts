import express from 'express';
import cors from 'cors';
import routes from "./routes/index.js";
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({
    origin: "https://uva-desenvolvimento-back-end-ava2.vercel.app/"
}));
app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;