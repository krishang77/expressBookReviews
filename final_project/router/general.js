const express = require("express");
const books = require("./booksdb.js");

const public_users = express.Router();

// Register a new user
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const auth = require("./auth_users.js");

  if (auth.users[username]) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  auth.users[username] = password;

  return res.status(201).json({
    message: "User successfully registered",
  });
});

// Get all books
public_users.get("/", async (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found",
  });
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
  const author = decodeURIComponent(req.params.author).toLowerCase();

  const results = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );

  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.status(404).json({
    message: "No books found for this author",
  });
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();

  const results = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );

  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.status(404).json({
    message: "No books found for this title",
  });
});

// Get reviews for a book
public_users.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found",
  });
});

module.exports.general = public_users;
