const request = require('supertest');

describe("Testing endpoint from server", () => {
    test("Testing GET endpoint", async () => {
        const response = await request("http://localhost:8080").get('/');
        expect(response.status).toBe(200);
    })
});