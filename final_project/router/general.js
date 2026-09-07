const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
