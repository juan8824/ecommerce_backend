const request = require('supertest');
const app = require('../app');
const ProductImg = require('../models/ProductImg');
require('../models')

let productId;
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

test("POST /products should create one product", async()=> {
    const newProduct = {
        title: "Headphones",
        description: "Replacing busted ear buds gets old fast. urBeats earphones were made to be an upgrade from the headphones that come with your music player: more durability, better sound, and a chance to do real justice to your music.",
        price: 97.27
    }
    const res = await request(app)
        .post('/products')
        .send(newProduct)
        .set('Authorization', `Bearer ${token}`);
    productId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newProduct.title);
})

test("GET /products should return all products", async()=> {
    const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1)
})

test("PUT /products should update one product", async()=> {
    const updatedProduct = {
        title: "Headphones Updated",
    }
    const res = await request(app)
        .put(`/products/${productId}`)
        .send(updatedProduct)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedProduct.title)
})

test("POST /products/:id/images should set the product's images", async() => {
    const image = await ProductImg.create({
        url: "url",
        filename: "filename"
    })
    const res = await request(app)
        .post(`/products/${productId}/images`)
        .send([image.id])
        .set('Authorization', `Bearer ${token}`);
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1)
})

test("DELETE /products/:id should delete one product", async() => {
    const res = await request(app).delete(`/products/${productId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
})