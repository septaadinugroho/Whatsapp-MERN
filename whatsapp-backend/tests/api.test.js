import request from "supertest";
import app from "../server"; // Memanggil aplikasi Express
import Message from "../dbMessages"; // Memanggil model pesan\
import { mongoConnect, mongoDisconnect } from "../services/mongo";

beforeAll(async () => {
  await mongoConnect();
});

// Tes untuk route "/"
describe("GET /", () => {
  it('responds with "Hello world!"', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("Hello world!");
  });
});

// Tes untuk route "/messages/sync"
describe("GET /messages/sync", () => {
  it("responds with JSON array of messages", async () => {
    const response = await request(app).get("/messages/sync");
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy(); // Verifikasi bahwa respons berupa array JSON
    // Anda dapat menambahkan assertion lain sesuai dengan logika aplikasi Anda
  });
});

// Tes untuk route "/messages/new"
describe("POST /messages/new", () => {
  it("creates a new message in the database", async () => {
    const newMessage = {
      message: "Jest Succes",
      name: "Jest",
      timestamp: "Jest Time",
      received: false,
    }; // Data untuk pesan baru

    const response = await request(app).post("/messages/new").send(newMessage);

    expect(response.statusCode).toEqual(201);

    // Verifikasi bahwa pesan telah dibuat di database
    const savedMessage = await Message.findOne({ name: "Jest" });
    expect(savedMessage).toBeTruthy();
    expect(savedMessage.message).toEqual("Jest Succes"); // Memeriksa bidang message
  });
});

afterAll(async () => {
  await mongoDisconnect();
});
