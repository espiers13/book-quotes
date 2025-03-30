const db = require("../db/index");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("Get all quotes - GET /api/quotes", () => {
  test("Sttus 200: Returns an array of all object quotes including quote, author, and year", () => {
    return request(app)
      .get("/api/quotes")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((quote) => {
          expect(quote).toHaveProperty("quote");
          expect(quote).toHaveProperty("author");
          expect(quote).toHaveProperty("year");
        });
      });
  });
});

describe("GET quote by author - GET /api/quotes/:author", () => {
  test("Status 200: Returns an array of quotes (inc. quote, author, year) where the author matches the author passed through", () => {
    const author = "John Green";
    return request(app)
      .get(`/api/quotes/${author}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          quote:
            "The only way out of the labyrinth of suffering is to forgive.",
          author: "John Green",
          year: "2009",
        });
      });
  });
  test("status code 401: returns appropriate status code and error message when author does not exist", () => {
    const author = "Emily Spiers";
    return request(app)
      .get(`/api/quotes/${author}`)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Author not found");
      });
  });
});

describe("POST new quote - POST /api/quotes", () => {
  test("Status 201: Posts a new quote to the database and returns new quote", () => {
    const newQuote = {
      quote:
        "In the end, we will remember not the words of our enemies, but the silence of our friends.",
      author: "Martin Luther King Jr.",
      year: "1963",
    };
    return request(app)
      .post(`/api/quotes`)
      .send(newQuote)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject(newQuote),
          expect(body).toHaveProperty("quote_id");
      });
  });
});

describe("GET random quote - GET /api/quote/random", () => {
  test("Status 200: returns a random quote and ensures it is different with each request", async () => {
    let previousQuote = await request(app)
      .get("/api/quote/random")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("quote");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("year");
        return body;
      });

    let newQuote = await request(app)
      .get("/api/quote/random")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("quote");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("year");
        return body;
      });

    expect(newQuote.quote).not.toEqual(previousQuote.quote);
    expect(newQuote.author).not.toEqual(previousQuote.author);
    expect(newQuote.year).not.toEqual(previousQuote.year);
  });
});
