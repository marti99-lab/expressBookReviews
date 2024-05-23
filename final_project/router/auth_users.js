const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Login endpoint
regd_users.post("/login", (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });
    req.session.username = username; // Store the username in session
    return res.status(200).json({ message: "User was successfully logged in." });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review endpoint
regd_users.post("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Assuming you store the username in the session
  const review = req.body.review; // Assuming the review is sent in the request body

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user already has a review for this book
  if (book.reviews && book.reviews[username]) {
    // If the user already has a review, modify it
    book.reviews[username] = review;
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been updated.` });
  } else {
    // If the user does not have a review, add a new one
    if (!book.reviews) {
      book.reviews = {}; // Initialize reviews object if it doesn't exist
    }
    book.reviews[username] = review;
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added.` });
  }
});

// Delete a book review endpoint
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Assuming you store the username in the session
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "You have not reviewed this book" });
  }

  // Remove the review posted by the current user
  delete book.reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;