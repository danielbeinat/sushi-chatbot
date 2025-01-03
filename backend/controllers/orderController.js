import Order from '../models/Order.js';
export const createOrder = async (req, res) => {
    const order = new Order({
        products: req.body.products,
        total: req.body.total,
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


