const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

// Login endpoint
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username,password)) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });
    return res.status(200).json({ accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
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

  if (!book.reviews || book.reviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  const filteredReviews = book.reviews.filter(review => review.username === username);
  if (filteredReviews.length === 0) {
    return res.status(404).json({ message: "You have not reviewed this book" });
  }

  // Remove the reviews posted by the current user
  book.reviews = book.reviews.filter(review => review.username !== username);
  
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;