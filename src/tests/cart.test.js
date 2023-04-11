const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models')

let cartId;
let token;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app)
        .post('/users/login')
        .send(credentials);
    token = res.body.token
})

test("POST /carts should create one cart", async() => {
    const product = await Product.create({
        title: "Headphones",
        description: "Replacing busted ear buds gets old fast. urBeats earphones were made to be an upgrade from the headphones that come with your music player: more durability, better sound, and a chance to do real justice to your music.",
        price: 97.27
    })
    const newCart = {
        quantity: 1,
        productId: product.id
    };
    const res = await request(app).post('/carts').send(newCart).set('Authorization', `Bearer ${token}`);
    await product.destroy();
    cartId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.quantity).toBe(newCart.quantity);
})

test("GET /carts should return all carts", async() => {
    const res = await request(app).get('/carts').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
})

test("PUT /carts/:id should update one cart", async() => {
    const updatedCart = {
        quantity: 3
    };
    const res = await request(app).put(`/carts/${cartId}`).send(updatedCart).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(updatedCart.quantity)
})

test("DELETE /carts/:id should delete one cart", async() => {
    const res = await request(app).delete(`/carts/${cartId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
})