const request = require('supertest');
const app = require("../app");

let userId;
let token;

test("POST /users should create one user", async()=> {
    const newUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "john1234",
        phone: "1234567890"
    }
    const res = await request(app)
        .post('/users')
        .send(newUser);
    userId = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(newUser.email);
})

test("POST /users/login should do login", async() => {
    const user = {
        email: "john@gmail.com",
        password: "john1234"
    };
    const res = await request(app)
        .post("/users/login")
        .send(user);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.token).toBeDefined();
})

test("POST /users/login with invalid credentials should return a 401 code", async() => {
    const user = {
        email: "john@gmail.com",
        password: "invalid password"
    };
    const res = await request(app)
        .post('/users/login')
        .send(user);
    expect(res.status).toBe(401);
})

test("GET /users should return all users", async()=> {
    const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2)
})

test("PUT /users should update one user", async()=> {
    const updatedUser = {
        firstName: "John Updated",
    }
    const res = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUser)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(updatedUser.firstName)
})


test("DELETE /users/:id should delete one user", async() => {
    const res = await request(app).delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
})