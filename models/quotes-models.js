const db = require("../db/index");

exports.fetchAllQuotes = () => {
  return db.query(`SELECT * FROM quotes;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchQuotesByAuthor = (author) => {
  return db
    .query(`SELECT author, quote, year FROM quotes WHERE author = $1`, [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 401,
          msg: "Author not found",
        });
      } else return rows[0];
    });
};

exports.createNewQuote = (newQuote) => {
  let queryStr = `INSERT INTO quotes (quote, author, year) values ($1, $2, $3) RETURNING *;`;
  const values = [newQuote.quote, newQuote.author, newQuote.year];

  return db.query(queryStr, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchRandomQuote = (quotesMax) => {
  const id = Math.floor(Math.random() * quotesMax - 1 + 1) + 1;

  return db
    .query(`SELECT author, quote, year FROM quotes WHERE quote_id = $1`, [id])
    .then(({ rows }) => {
      return rows[0];
    });
};
