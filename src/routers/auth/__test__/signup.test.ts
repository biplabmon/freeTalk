import request from "supertest";
import { app } from "../../../app";


it("return 201 on successful signup", async ()=>{
    return request(app)
    .post("/signup")
    .send({
        email: "biplab@test.com",
        password: "1234567"
    })
    .expect(201)
});

it("sets the cookie after successful signup", async ()=>{
    const res = await request(app)
    .post("/signup")
    .send({
        email: "biplab@test.com",
        password: "1234567"
    })
    .expect(201)

    expect(res.get('Set-Cookie')).toBeDefined()
});