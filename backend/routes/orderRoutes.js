import express from "express";
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', createOrder);

export default router;
