import { FruitInput } from "services/fruits-service"
import app from "../src/app"
import supertest from "supertest"

const api = supertest(app)

describe("POST /fruits", () => {
    it("should return 201 when inserting a fruit", async () => {
        const fruit: FruitInput = {
            name: "Abacate",
            price: 15
        }

        const result = await api.post("/fruits").send(fruit);

        expect(result.statusCode).toBe(201)
    })
    it("should return 409 when inserting a fruit that is already registered", async () => {
        const fruit: FruitInput = {
            name: "Mamão",
            price: 20
        }

        await api.post("/fruits").send(fruit);
        const result = await api.post("/fruits").send(fruit);

        expect(result.statusCode).toBe(409)
    })
    it("should return 422 when inserting a fruit with data missing", async () => {
        const fruit = {
            name: "Mamão"
        }

        const result = await api.post("/fruits").send(fruit);

        expect(result.statusCode).toBe(422)
    })
})

describe("GET /fruits", () => {
    it("shoud return 404 when trying to get a fruit that doesn't exists", async () => {
        const result = await api.get("/fruits/999");

        expect(result.statusCode).toBe(404)
    })
    it("should return 400 when id param is not valid", async () => {
        const result = await api.get("/fruits/mamao");

        expect(result.statusCode).toBe(400)
    })
    it("should return a fruit given an id", async () => {
        const result = await api.get("/fruits/1");

        expect(result.body).toEqual({
            name: "Abacate",
            price: 15,
            id: 1
        })
    })
    it("should return all fruits", async () => {
        const result = await api.get("/fruits");

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        )
    })
})