const db = require("../index.js");
const format = require("pg-format");

const seed = ({ quotesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS quotes;`)
    .then(() => {
      return db.query(`
          CREATE TABLE quotes (   
              quote_id SERIAL PRIMARY KEY,
              quote VARCHAR NOT NULL,
              author VARCHAR NOT NULL,
              year VARCHAR NOT NULL
          );`);
    })
    .then(() => {
      const insertQuotesString = format(
        "INSERT INTO quotes (quote, author, year) VALUES %L RETURNING *;",
        quotesData.map(({ quote, author, year }) => [quote, author, year])
      );
      return db.query(insertQuotesString);
    })
    .catch((err) => {
      console.error("Error seeding the database:", err);
    });
};

module.exports = seed;
