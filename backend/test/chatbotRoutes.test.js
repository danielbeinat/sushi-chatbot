import request from 'supertest';
import express from 'express';
import chatbotRoutes from '../routes/chatRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/chat', chatbotRoutes);

describe('Chatbot Routes', () => {
    it('should respond with a welcome message on INITIAL state', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({
                message: '',
                currentOrder: [],
                userId: null,
                conversationState: 'INITIAL',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.reply).toContain('¡Hola! Soy tu asistente para pedidos de sushi.');
    });

    it('should respond with menu categories on MAIN_MENU state', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({
                message: 'ver menú',
                currentOrder: [],
                userId: null,
                conversationState: 'MAIN_MENU',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.reply).toContain('¿Qué te gustaría ver? Tenemos:');
    });

});

export default app;