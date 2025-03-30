const express = require("express");
const app = express();
const cors = require("cors");

const {
  getAllQuotes,
  getQuotesByAuthor,
  postNewQuote,
  getRandomQuote,
} = require("./controllers/quotes-controllers");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

// MIDDLEWARE

app.use(express.json());
app.use(cors());

// GET REQUESTS

app.get("/api/quotes", getAllQuotes);

app.get("/api/quotes/:author", getQuotesByAuthor);

app.get("/api/quote/random", getRandomQuote);

// POST REQUESTS

app.post("/api/quotes", postNewQuote);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found!" });
});

module.exports = app;
