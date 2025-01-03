import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    products: [{
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', OrderSchema);

