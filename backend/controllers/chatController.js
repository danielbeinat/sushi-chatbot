import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { categories } from '../config/constants.js';

const tempOrderStorage = new Map();

export const handleChat = async (req, res) => {
    const { message, currentOrder, userId, conversationState } = req.body;
    const sessionId = req.body.sessionId || 'default';

    let user;
    if (userId) {
        user = await User.findById(userId);
    }

    let reply = '';
    let newState = conversationState;
    let menuItems = null;
    let addedProduct = null;
    let updatedCurrentOrder = [...currentOrder];

    let tempOrderData = tempOrderStorage.get(sessionId) || {};

    switch (conversationState) {
        case 'INITIAL':
            reply = "¡Hola! Soy tu asistente para pedidos de sushi. ¿En qué puedo ayudarte hoy?\n1. Ver menú\n2. Hacer un pedido\n3. Preguntas frecuentes";
            newState = 'MAIN_MENU';
            break;

        case 'MAIN_MENU':
            if (message.toLowerCase().includes('ver menú') || message === '1') {
                reply = "¿Qué te gustaría ver? Tenemos: " + categories.join(', ') + ".";
                newState = 'CATEGORY_SELECTION';
            } else if (message.toLowerCase().includes('hacer un pedido') || message === '2') {
                reply = "¡Perfecto! ¿Qué te gustaría ordenar? Puedo mostrarte nuestras categorías: " + categories.join(', ') + ".";
                newState = 'CATEGORY_SELECTION';
            } else if (message.toLowerCase().includes('preguntas') || message === '3') {
                reply = "¿Qué te gustaría saber? Puedes preguntar sobre:\n1. Horarios de atención\n2. Métodos de pago\n3. Tiempo de entrega\n4. Opciones vegetarianas";
                newState = 'FAQ';
            } else {
                reply = "Lo siento, no entendí. Por favor, elige una opción: 1. Ver menú, 2. Hacer un pedido, o 3. Preguntas frecuentes.";
            }
            break;

        case 'FAQ':
            if (message.toLowerCase().includes('horarios') || message === '1') {
                reply = "Estamos abiertos de lunes a domingo, de 11:00 AM a 10:00 PM.";
            } else if (message.toLowerCase().includes('pago') || message === '2') {
                reply = "Aceptamos efectivo, tarjetas de crédito/débito y pagos móviles.";
            } else if (message.toLowerCase().includes('tiempo') || message === '3') {
                reply = "El tiempo promedio de entrega es de 30-45 minutos, dependiendo de tu ubicación.";
            } else if (message.toLowerCase().includes('vegetarianas') || message === '4') {
                reply = "Ofrecemos varias opciones vegetarianas, incluyendo rolls de aguacate y pepino, y temaki vegetariano.";
            } else {
                reply = "Lo siento, no entendí tu pregunta. ¿Puedes ser más específico?";
            }
            reply += "\n¿Hay algo más en lo que pueda ayudarte?";
            newState = 'MAIN_MENU';
            break;

        case 'CATEGORY_SELECTION':
            const category = categories.find(cat => message.toLowerCase().includes(cat.toLowerCase()));
            if (category) {
                const products = await Product.find({ category: category });

                menuItems = products;
                reply = `Aquí están nuestros productos de ${category}:\n` +
                    products.map(p => `${p.name} - $${p.price} - ${p.description}`).join('\n') +
                    "\n¿Cuál te gustaría pedir?";
                newState = 'PRODUCT_SELECTION';
            } else {
                reply = "No reconozco esa categoría. Por favor, elige entre: " + categories.join(', ');
            }
            break;

        case 'PRODUCT_SELECTION':
            const product = await Product.findOne({ name: { $regex: message, $options: 'i' } });
            if (product) {
                reply = `Has seleccionado ${product.name}. ¿Cuántos quieres?`;
                tempOrderData.selectedProduct = product;
                newState = 'QUANTITY_SELECTION';
            } else {
                reply = "No encontré ese producto. ¿Puedes ser más específico?";
            }
            break;

        case 'QUANTITY_SELECTION':
            const quantity = parseInt(message);
            if (isNaN(quantity) || quantity <= 0) {
                reply = "Por favor, ingresa un número válido para la cantidad.";
            } else {
                const selectedProduct = tempOrderData.selectedProduct;
                if (selectedProduct) {
                    updatedCurrentOrder.push({
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        description: selectedProduct.description,
                        category: selectedProduct.category,
                        quantity: quantity
                    });
                    reply = `He agregado ${quantity} ${selectedProduct.name} a tu pedido. ¿Te gustaría agregar algo más a tu pedido?`;
                    newState = 'ADD_MORE';
                    tempOrderData.selectedProduct = null;
                } else {
                    reply = "Lo siento, hubo un problema al agregar el producto. ¿Puedes intentar seleccionarlo de nuevo?";
                    newState = 'CATEGORY_SELECTION';
                }
            }
            break;

        case 'ADD_MORE':
            if (message.toLowerCase().includes('sí') || message.toLowerCase().includes('si')) {
                reply = "¿Qué más te gustaría pedir? Puedo mostrarte: " + categories.join(', ') + ".";
                newState = 'CATEGORY_SELECTION';
            } else if (message.toLowerCase().includes('no')) {
                const total = updatedCurrentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                reply = "Tu pedido es:\n" +
                    updatedCurrentOrder.map(item => `${item.quantity} ${item.name}`).join('\n') +
                    `\nTotal: $${total.toFixed(2)}\n¿Es correcto?`;
                newState = 'CONFIRM_ORDER';
            } else {
                reply = "No entendí. ¿Quieres agregar algo más? Por favor responde 'Sí' o 'No'.";
            }
            break;

        case 'CONFIRM_ORDER':
            if (message.toLowerCase().includes('sí') || message.toLowerCase().includes('si')) {
                if (!user) {
                    reply = "Para finalizar tu pedido, necesito tu nombre y correo electrónico. Por favor, proporciónamelos en este formato: 'Nombre, correo@ejemplo.com'";
                    newState = 'GET_USER_INFO';
                } else {
                    reply = "Gracias por confirmar. ¿A dónde enviamos tu pedido? Por favor, proporciona tu dirección.";
                    newState = 'GET_ADDRESS';
                }
            } else if (message.toLowerCase().includes('no')) {
                reply = "Entendido. ¿Qué te gustaría cambiar de tu pedido?";
                newState = 'CATEGORY_SELECTION';
            } else {
                reply = "No entendí. ¿El pedido es correcto? Por favor responde 'Sí' o 'No'.";
            }
            break;

        case 'GET_USER_INFO':
            const [name, email] = message.split(',').map(item => item.trim());
            if (email && email.includes('@') && email.includes('.')) {
                user = await User.findOne({ email });
                if (!user) {
                    user = new User({ name, email });
                    await user.save();
                }
                reply = `Gracias ${name}. He guardado tus datos. ¿A dónde enviamos tu pedido? Por favor, proporciona tu dirección.`;
                newState = 'GET_ADDRESS';
            } else {
                reply = "Lo siento, no pude procesar tu información. Por favor, proporciona tu nombre y correo electrónico en este formato: 'Nombre, correo@ejemplo.com'";
            }
            break;

        case 'GET_ADDRESS':
            if (message.length > 10) {
                const total = updatedCurrentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const newOrder = new Order({
                    user: user._id,
                    products: updatedCurrentOrder,
                    total: total,
                    address: message
                });
                await newOrder.save();
                user.orders.push(newOrder._id);
                await user.save();
                reply = `Gracias por tu pedido, ${user.name}. Estará listo en 30-45 minutos. Tu número de orden es: ${newOrder._id}. Si necesitas algo más, no dudes en decirlo.`;
                newState = 'INITIAL';
                updatedCurrentOrder = [];
            } else {
                reply = "Lo siento, necesito una dirección más detallada. Por favor, proporciona tu dirección completa.";
            }
            break;

        default:
            reply = "¡Hola! Soy tu asistente para pedidos de sushi. ¿En qué puedo ayudarte hoy?\n1. Ver menú\n2. Hacer un pedido\n3. Preguntas frecuentes";
            newState = 'MAIN_MENU';
    }

    tempOrderStorage.set(sessionId, tempOrderData);

    res.json({
        reply,
        newState,
        menuItems,
        addedProduct,
        currentOrder: updatedCurrentOrder,
        userId: user ? user._id : null
    });
};


