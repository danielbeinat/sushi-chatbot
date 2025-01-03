import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

const Port = process.env.Port || 3000;

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/chat', chatRoutes)


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})
