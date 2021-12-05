require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

//Database
const database = require('./database')

//Models
const bookModel = require('./databases/book')
const authorModel = require('./databases/author')
const publicationModel = require('./databases/publications')

//Initialize
const booky = express()

//Established Database connection
// process.env.MONGO_URL
mongoose.connect(
    process.env.MONGO_URL
).then(() => console.log('Connection Established'))

//API of all books
/*
Route           /
Description     Get specific book
Access          Public
Parameter       isbn 
Methods         GET
*/
booky.get('/', async (req, res) => {
    const getAllBooks = await bookModel.find()
    return res.json(getAllBooks)
})

//API for spcific book
//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /
Description     Get specific book
Access          Public
Parameter       isbn 
Methods         GET
*/
booky.get('/is/:isbn', async (req, res) => {
    const getSpecificBook = await bookModel.findOne({ ISBN: req.params.isbn })
    if (!getSpecificBook) {
        return res.json({ error: `No book of ISBN ${req.params.isbn} found` })
    }
    return res.json(getSpecificBook)
})

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book by category
Access          Public
Parameter       category
Methods         GET
*/
booky.get('/c/:category', async (req, res) => {
    const getSpecificBook = await bookModel.findOne({ category: [req.params.category] })
    if (!getSpecificBook) {
        return res.json({ error: `No book of Category "${req.params.category}" found` })
    }
    return res.json(getSpecificBook)
})

//GET BOOKS on a specific language
/*
Route           /l
Description     Get specific book by language
Access          Public
Parameter       language
Methods         GET
*/
booky.get('/l/:language', async (req, res) => {
    const getSpecificBook = await bookModel.findOne({ language: req.params.language })
    if (!getSpecificBook) {
        return res.json({ error: `No book of language ${req.params.language} found` })
    }
    return res.json(getSpecificBook)
})

//GET all authors
/*
Route           /a
Description     Get all authors
Access          Public
Parameter       none
Methods         GET
*/
booky.get('/a/', async (req, res) => {
    const getAllAuthors = await authorModel.find()
    return res.json(getAllAuthors)
})

//GET authors by ID
/*
Route           /a
Description     Get authors by ID
Access          Public
Parameter       id
Methods         GET
*/
booky.get('/a/:id', async (req, res) => {
    const getSpecificAuthor = await authorModel.findOne({ id: req.params.id })
    if (!getSpecificAuthor) {
        return res.json({ error: `No Author of ID: ${req.params.id} found` })
    }
    return res.json(getSpecificAuthor)
})

//GET authors by book
/*
Route           /a/book/
Description     Get authors by book
Access          Public
Parameter       id
Methods         GET
*/
booky.get('/a/book/:isbn', async (req, res) => {
    const getSpecificAuthor = await authorModel.findOne({ books: [req.params.isbn] })
    if (!getSpecificAuthor) {
        return res.json({ error: `No Author of book: ${req.params.isbn} found` })
    }
    return res.json(getSpecificAuthor)
})

//GET all publications
/*
Route           /a/book/
Description     Get all publications
Access          Public
Parameter       id
Methods         GET
*/
booky.get('/p/', async (req, res) => {
    const getAllPublications = await publicationModel.find()
    return res.json(getAllPublications)
})

//GET publications by ID
/*
Route           /a
Description     Get publications by ID
Access          Public
Parameter       id
Methods         GET
*/
booky.get('/p/:id', async (req, res) => {
    const getSpecificPublication = await publicationModel.findOne({ id: req.params.id })
    if (!getSpecificPublication) {
        return res.json({ error: `No Publication of ID: ${req.params.id} found` })
    }
    return res.json(getSpecificPublication)
})

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req, res) => {
    const newBook = req.body;
    const addNewBook = bookModel.create(newBook)
    return res.json({ books: addNewBook, message: 'New book added' });
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = authorModel.create(newAuthor)
    // database.author.push(newAuthor);
    return res.json({ authors: addNewAuthor, message: "New author added" });
});

//ADD NEW AUTHORS
/*
Route           /publication/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", (req, res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({ updatedPublications: database.publication });
});

//UPADTE PUB AND BOOK
/*
Route           /publication/update/book
Description     update the pub and the book
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put('/publication/update/book/:isbn', (req, res) => {
    //Update pub
    database.publications.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn)
        }
    })
    //Update books
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId
            return;
        }
    })
    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated!"
        }
    )
})



booky.listen(3000, () => console.log('Server is up and running'))