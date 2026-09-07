const express = require('express');
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

/**
 * Helper: Filter books by a given field (author, title, etc.)
 */
function filterBooksByField(field, value) {
    return Object.values(books).filter(book => book[field] === value);
}

/**
 * Helper: Standard JSON response
 */
function sendJSON(res, data, status = 200) {
    return res.status(status).json(data);
}

/**
 * Register a new user
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendJSON(res, { message: "Both username and password are required to register." }, 400);
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return sendJSON(res, { message: `The username '${username}' is already taken. Please choose another.` }, 409);
    }

    users.push({ username, password });
    return sendJSON(res, { message: "Registration successful. You may now log in." });
});

/**
 * Get all books
 */
public_users.get("/", (req, res) => {
    return sendJSON(res, books);
});

/**
 * Get book details by ISBN
 */
public_users.get("/isbn/:isbn", (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return sendJSON(res, { message: `No book found with ISBN '${isbn}'.` }, 404);
    }

    return sendJSON(res, books[isbn]);
});

/**
 * Get books by author
 */
public_users.get("/author/:author", (req, res) => {
    const { author } = req.params;
    const results = filterBooksByField("author", author);

    if (results.length === 0) {
        return sendJSON(res, { message: `No books found written by '${author}'.` }, 404);
    }

    return sendJSON(res, results);
});

/**
 * Get books by title
 */
public_users.get("/title/:title", (req, res) => {
    const { title } = req.params;
    const results = filterBooksByField("title", title);

    if (results.length === 0) {
        return sendJSON(res, { message: `No books found with the title '${title}'.` }, 404);
    }

    return sendJSON(res, results);
});

/**
 * Get book reviews
 */
public_users.get("/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return sendJSON(res, { message: `Cannot retrieve reviews. No book found with ISBN '${isbn}'.` }, 404);
    }

    return sendJSON(res, books[isbn].reviews || {});
});

module.exports.general = public_users;
