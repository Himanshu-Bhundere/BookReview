const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if(!username || !password){
        res.status(404).json({ error: 'Incomplete credentials' });
    }
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already taken" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully", username });
});

// Get the list of books
public_users.get('/',function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book_author = Object.values(books).filter(book => book.author === author);
    if (book_author) { res.send(book_author); }
    else { res.status(404).json({ error: 'Author not found' }); }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book_title = Object.values(books).filter(book => book.title === title);
    if (book_title) { res.send(book_title); }
    else { res.status(404).json({ error: 'Book with this Title not found' }); }
});

//  Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        res.json({ reviews: reviews });
    }
    else { res.status(404).json({ error: 'ISBN not found' }); }
});

module.exports.general = public_users;
