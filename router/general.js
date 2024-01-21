const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
  //res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book_isbn = Object.values(books).filter((book) => book.isbn === isbn);
  if (book_isbn) {
    res.send(book_isbn);
  } else {
    res.status(404).json({ error: "ISBN not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let book_author = Object.values(books).filter(
    (book) => book.author === author
  );
  if (book_author) {
    res.send(book_author);
  } else {
    res.status(404).json({ error: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let book_title = Object.values(books).filter((book) => book.title === title);
  if (book_title) {
    res.send(book_title);
  } else {
    res.status(404).json({ error: "Book with this Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book_isbn = Object.values(books).find((book) => book.isbn === isbn);
  if (book_isbn) {
    const reviews = book_isbn.reviews;
    res.json({ reviews: reviews });
  } else {
    res.status(404).json({ error: "ISBN not found" });
  }
});

//Using Async And Promises

const getAllBooksAsync = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};
public_users.get("/books", async (req, res) => {
  try {
    const allBooks = await getAllBooksAsync();
    res.json(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchBookByISBNAsync = async (isbn) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = books.find((b) => b.isbn === isbn);
      resolve(book);
    }, 1000);
  });
};
public_users.get("/books/search/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await searchBookByISBNAsync(isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchBooksByAuthorAsync = async (author) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = books.filter((b) => b.author === author);
      resolve(matchingBooks);
    }, 1000);
  });
};
public_users.get("/books/search/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const matchingBooks = await searchBooksByAuthorAsync(author);
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ error: "Books not found for the given author" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchBooksByTitleAsync = async (title) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = books.filter((b) =>
        b.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(matchingBooks);
    }, 1000);
  });
};
public_users.get("/books/search/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const matchingBooks = await searchBooksByTitleAsync(title);
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ error: "Books not found for the given title" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports.general = public_users;
