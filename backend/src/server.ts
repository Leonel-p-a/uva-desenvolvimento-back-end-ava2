import dns from "dns";
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});