const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;
    if(books[isbn]){
        books[isbn].reviews[username] = review;
        return res.status(200).send(`Review successfully added to isbn ${isbn}`);
    }
    else{return res.status(404).json({ message: `ISBN ${isbn} not found` });}
});


// Delete review of logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    if (books[isbn]) {
        if(books[isbn].reviews[username]){
        delete books[isbn].reviews[username];}
        else{return res.status(200).send(`Review of the username - ${username} not found`);}
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
