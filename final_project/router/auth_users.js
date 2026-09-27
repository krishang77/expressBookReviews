const express = require("express");
const jwt = require("jsonwebtoken");

const users = {};
const authenticated_users = express.Router();

function isValid(username) {
  return users[username] !== undefined;
}

// Login
authenticated_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (!users[username] || users[username] !== password) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const accessToken = jwt.sign(
    {
      username: username,
    },
    "access",
    {
      expiresIn: "1h",
    }
  );
  req.session.authorization = {
  accessToken: accessToken,
};

  return res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
  });
});

// Add / update review
authenticated_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  const review = req.body.review;

  const books = require("./booksdb.js");

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// Delete review
authenticated_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const books = require("./booksdb.js");

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = authenticated_users;
module.exports.users = users;
module.exports.isValid = isValid;
