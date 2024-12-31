const { User } = require("../../models/user");
const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
  beforeAll(() => {
    server = require("../../index");
  });
  afterAll(async () => {
    await Genre.deleteMany({});
    await server.close();
    await mongoose.connection.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401); 
  });
});

