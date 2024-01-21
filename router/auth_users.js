const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const minLength = 8;
    const validCharsRegex = /^[a-zA-Z0-9]+$/;
    return username.length >= minLength && validCharsRegex.test(username);
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        return true;
    }
    return false;
}

const secretKey = 'thisISsecretKey';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Login endpoint for authenticated users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, secretKey);
        return res.status(200).json({ message: "Succesfully Login", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

regd_users.get("/", (req, res) => {
    res.send(users);
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // const { review } = req.body;
    // const username = req.user.username;
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    // book.reviews[username] = review;
    res.status(200).json({ message: 'Review added successfully' });
});

regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    if (!book.reviews.hasOwnProperty(username)) {
        return res.status(404).json({ error: 'Review not found for the logged-in user' });
    }
    delete book.reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully', book });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
