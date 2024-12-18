const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        // Simulating an asynchronous operation
        const fetchBooks = async () => {
            return books; // Return the books object
        };

        const data = await fetchBooks(); // Await the promise resolution
        return res.status(200).json({ "books": data });
    } catch (error) {
        return res.status(404).json({ message: "Books not found" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Simulate an asynchronous operation using a Promise
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        // Send the successful response
        return res.status(200).json(book);
    } catch (error) {
        // Handle errors
        return res.status(404).json({ message: error });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const author = req.params.author;

    try {
        // Simulate an asynchronous operation with a Promise
        const matchingBooks = await new Promise((resolve) => {
            const result = Object.keys(books).reduce((acc, key) => {
                if (books[key].author === author) {
                    acc.push({
                        "isbn": key,
                        "title": books[key].title,
                        "reviews": books[key].reviews || {}
                    });
                }
                return acc;
            }, []);
            resolve(result);
        });

        // Check if books were found and return response
        if (matchingBooks.length > 0) {
            return res.status(200).json({ "booksbyauthor": matchingBooks });
        } else {
            throw new Error("No books found for this author");
        }
    } catch (error) {
        // Handle the case where no books were found
        return res.status(404).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    const title = req.params.title;

    try {
        // Simulate an asynchronous operation with a Promise
        const matchingBooks = await new Promise((resolve) => {
            const result = Object.keys(books).reduce((acc, key) => {
                if (books[key].title === title) {
                    acc.push({
                        "isbn": key,
                        "author": books[key].author,
                        "reviews": books[key].reviews || {}
                    });
                }
                return acc;
            }, []);
            resolve(result);
        });

        // Check if books were found and return response
        if (matchingBooks.length > 0) {
            return res.status(200).json({ "booksbytitle": matchingBooks });
        } else {
            throw new Error("No books found for this title");
        }
    } catch (error) {
        // Handle the error case
        return res.status(404).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(books[isbn]["reviews"]);
    }
    else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
