const request = require('supertest');
const app = require("../app");

let token;
let categoryId;

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

test("POST /categories should create one category", async()=> {
    const newCategory = {
        name: "Technology"
    };
    const res = await request(app)
        .post('/categories')
        .send(newCategory)
        .set('Authorization', `Bearer ${token}`);
    categoryId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newCategory.name)
})

test("GET /categories should return all categories", async() => {
    const res = await request(app).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1)
})

test("DELETE /categories/:id should delete one category", async() => {
    const res = await request(app)
        .delete(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
})