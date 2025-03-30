const {
  fetchAllQuotes,
  fetchQuotesByAuthor,
  createNewQuote,
  fetchRandomQuote,
} = require("../models/quotes-models");

exports.getAllQuotes = (req, res, next) => {
  fetchAllQuotes().then((quotesData) => {
    res.status(200).send(quotesData);
  });
};

exports.getQuotesByAuthor = (req, res, next) => {
  const { author } = req.params;
  fetchQuotesByAuthor(author)
    .then((quotesData) => {
      res.status(200).send(quotesData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewQuote = (req, res, next) => {
  const newQuote = req.body;
  createNewQuote(newQuote)
    .then((quoteData) => {
      res.status(201).send(quoteData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getRandomQuote = (req, res, next) => {
  fetchAllQuotes()
    .then((quotesData) => {
      (quotesMax = quotesData.length),
        fetchRandomQuote(quotesMax)
          .then((quoteData) => {
            res.status(200).send(quoteData);
          })
          .catch((err) => {
            next(err);
          });
    })
    .catch((err) => {
      next(err);
    });
};
