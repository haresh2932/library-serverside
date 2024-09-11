const Book = require('../model/book.model');



const createBook = async (req, res) => {
    try {
        const { title, author, genre, publicationYear, isbn, category, rentPerDay } = req.body;
        const newBook = new Book({ title, author, genre, publicationYear, isbn, category, rentPerDay });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};


const listBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};


const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};

const getBooksByName = async (req, res) => {
    try {
        const { term } = req.query;
        const books = await Book.find({ title: new RegExp(term, 'i') });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getBooksByRentRange = async (req, res) => {
    try {
        const { minRent, maxRent } = req.query;
        const books = await Book.find({ rentPerDay: { $gte: minRent, $lte: maxRent } });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBooksByCriteria = async (req, res) => {
    try {
      const { category, term, minRent, maxRent } = req.query;
      const books = await Book.find({
        category,
        title: new RegExp(term, 'i'),
        rentPerDay: { $gte: minRent, $lte: maxRent }
      });
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

module.exports = {
    listBooks,
    createBook,
    getBookById,
    updateBook,
    deleteBook,
    getBooksByName,
    getBooksByRentRange,
    getBooksByCriteria
}