const express = require('express');
const axios = require('axios');
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


public_users.get('/', function (req, res) {
  axios.get('http://your-api-url/books')
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Error fetching books:", error);
      return res.status(500).json({ message: "Internal server error" });
    });
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://your-api-url/books/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Error fetching book details:", error);
      return res.status(404).json({ message: "Book not found" });
    });
});


public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://your-api-url/books?author=${author}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Error fetching book details by author:", error);
      return res.status(404).json({ message: "No books found by this author" });
    });
});


public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://your-api-url/books?title=${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Error fetching book details by title:", error);
      return res.status(404).json({ message: "No books found with this title" });
    });
});

module.exports.general = public_users;