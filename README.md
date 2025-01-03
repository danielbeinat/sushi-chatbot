# Sushi Order Chatbot

Este proyecto es un chatbot interactivo para realizar pedidos de sushi. Está diseñado para ayudar a los usuarios a navegar por el menú, realizar pedidos, y responder preguntas frecuentes.

---

## 1. Instalación y ejecución del proyecto

### Requisitos previos

- Node.js (versión 14 o superior)
- MongoDB instalado y en ejecución
- Archivo `.env` configurado con las siguientes variables:
  - PORT = 5000
  - MONGO_URL=mongodb://localhost:27017/sushi-chatbot

### Pasos para instalar

1. Clona este repositorio:

   git clone <URL-del-repositorio>

2. Configurar el Backend:

cd backend
npm install

Iniciar el servidor

nodemon server.js

3. Configurar el Frontend:

cd ../frontend
npm install

Iniciar el servidor de desarrollo:

npm run dev

Mensajes de Inicio

1. Ver menú
2. Hacer un pedido
3. Preguntas frecuentes

## 2. Respuestas del Bot

Mostrar menú:
¿Qué te gustaría ver? Tenemos: Rolls, Nigiri, Sashimi, Temaki, Entradas, Sopas, Bebidas.

Preguntas frecuentes:
¿Qué te gustaría saber? Puedes preguntar sobre:

1. Horarios de atención
2. Métodos de pago
3. Tiempo de entrega
4. Opciones vegetarianas

Endpoints:

/api/menu: Relacionado con el menú del restaurante.
/api/orders: Manejo de pedidos.
/api/chat: Comunicación del asistente de chat con el usuario.

## 3. Base de Datos

Datos de Ejemplo

Los siguientes datos iniciales se pueden cargar en MongoDB:

const products = [
{ name: 'Sushi Roll California', price: 12.99, description: 'Rollo de sushi con aguacate, pepino y cangrejo', category: 'Rolls' },
{ name: 'Nigiri de Salmón', price: 9.99, description: 'Salmón fresco sobre arroz', category: 'Nigiri' },
{ name: 'Sashimi de Atún', price: 15.99, description: 'Láminas finas de atún fresco', category: 'Sashimi' },
{ name: 'Temaki de Camarón', price: 8.99, description: 'Cono de alga nori con arroz y camarón', category: 'Temaki' },
{ name: 'Edamame', price: 5.99, description: 'Vainas de soja hervidas y saladas', category: 'Entradas' },
{ name: 'Gyoza', price: 7.99, description: 'Empanadillas japonesas a la plancha', category: 'Entradas' },
{ name: 'Miso Soup', price: 4.99, description: 'Sopa tradicional japonesa', category: 'Sopas' },
{ name: 'Green Tea', price: 2.99, description: 'Té verde japonés', category: 'Bebidas' },
{ name: 'Sake', price: 11.99, description: 'Vino de arroz japonés', category: 'Bebidas' },
];

## 4. Cómo ejecutar los tests

Asegúrate de que las dependencias necesarias estén instaladas en tu proyecto. Si no lo están, instálalas ejecutando:

npm install jest supertest --save-dev

Configura Jest en tu proyecto si aún no lo has hecho. Puedes agregar un script en el archivo package.json:
"scripts": {
"test": "jest"
}

Ejecuta los tests utilizando el siguiente comando:

npm test
