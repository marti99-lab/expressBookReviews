const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the list of books available in the shop
public_users.get('/', async (req, res) => {
  try {
    const booksList = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(booksList);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve) => {
      resolve(books[isbn]);
    });
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const filteredBooks = await new Promise((resolve) => {
      resolve(Object.values(books).filter(book => book.author === author));
    });
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const filteredBooks = await new Promise((resolve) => {
      resolve(Object.values(books).filter(book => book.title === title));
    });
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const bookReviews = await new Promise((resolve) => {
      resolve(books[isbn] ? books[isbn].reviews : null);
    });
    if (bookReviews) {
      return res.status(200).json(bookReviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;