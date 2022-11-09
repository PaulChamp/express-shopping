process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "popsicle" };

beforeEach(function () {
    items.push(popsicle);
});

afterEach(function () {
    items.length = 0;
});

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual([popsicle]);
    });
});

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const resp = await request(app).get(`/items/${popsicle.name}`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual(popsicle);
    });

    test("Responds with 404 if can't find item", async function () {
        const resp = await request(app).get(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /items", function () {
    test("Creates a new item", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "cheerios",
                price: 3.4
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            "added": {
                name: "cheerios",
                price: 3.4
            }
        });
    });


    test("Creates a new item, no name", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "",
                price: 3.4
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            "error": {
                message: "name is required",
                status: 400
            }
        });
    });
});

describe("PATCH /items/:name", function () {
    test("Updates a single item", async function () {
        const resp = await request(app)
            .patch(`/items/${popsicle.name}`)
            .send({
                name: "new popsicle",
                price: 2.45
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: "new popsicle",
                price: 2.45
            }
        });
    });

    test("update a single item, no name", async function () {
        const resp = await request(app)
            .patch(`/items/${popsicle.name}`)
            .send({
                name: "",
                price: 2.45
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            "error": {
                message: "name is required",
                status: 400
            }
        });
    });

    test("Responds with 404 if id invalid", async function () {
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function () {
    test("Deletes a single a item", async function () {
        const resp = await request(app).delete(`/items/${popsicle.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted" });
    });
});
