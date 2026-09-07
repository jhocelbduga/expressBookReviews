const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const userExists = users.find((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Register new user
    users.push({ username: username, password: password });

    return res.status(200).json({ message: "User registered successfully." });
});
const axios = require("axios");

public_users.get("/", async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return all books in a neatly formatted JSON string
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;     // Retrieve ISBN from request parameters

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));   // Neatly formatted output
    } else {
        res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 4));
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;   // Retrieve author from request parameters
    const keys = Object.keys(books);    // Get all book ISBN keys

    let filteredBooks = [];

    // Iterate through all books and match author
    keys.forEach((isbn) => {
        if (books[isbn].author === author) {
            filteredBooks.push(books[isbn]);
        }
    });

    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));   // Neatly formatted output
    } else {
        res.status(404).send(JSON.stringify({ message: "No books found for this author" }, null, 4));
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;      // Retrieve title from request parameters
    const keys = Object.keys(books);     // Get all book ISBN keys

    let filteredBooks = [];

    // Iterate through all books and match title
    keys.forEach((isbn) => {
        if (books[isbn].title === title) {
            filteredBooks.push(books[isbn]);
        }
    });

    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));   // Neatly formatted output
    } else {
        res.status(404).send(JSON.stringify({ message: "No books found with this title" }, null, 4));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;   // Retrieve ISBN from request parameters

  if (books[isbn]) {
      // Return only the reviews for the given ISBN
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 4));
  }
});

module.exports.general = public_users;
