const Book = require('../model/book.model');
const Transaction = require('../model/transaction.model');
const Users=require('../model/user.model')

const listTransaction= async (req, res) => {
    try {
        const transaction = await Transaction.find();

        if (!transaction || transaction.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction data not found",
            });
        }
        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const issueBook = async (req, res) => {
    try {
        const { bookName, userName, issueDate } = req.body;
        const book = await Book.findOne({ title: bookName });
        const user = await Users.findOne({ name: userName });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const transaction = new Transaction({
            bookId: book._id,
            userId:user._id,
            issueDate,
        });

        await transaction.save();
        res.status(201).json({ success: true, message: "Book issued successfully", transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const { bookName, userName, returnDate } = req.body;
        const book = await Book.findOne({ title: bookName });
        const user = await Users.findOne({ name: userName });
        console.log(book);
        
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const transaction = await Transaction.findOne({  bookId: book._id, userId:user._id, returnDate: { $exists: false }  });
        console.log(transaction);
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        const rentDays = Math.ceil((new Date(returnDate) - new Date(transaction.issueDate)) / (1000 * 60 * 60 * 24));
        const rentPaid = rentDays * book.rentPerDay;

        transaction.returnDate = returnDate;
        transaction.rentPaid = rentPaid;
        await transaction.save();

        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            rentPaid,
            transaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getIssuedBookHistory = async (req, res) => {
    try {
        const { bookName } = req.query;
        const book = await Book.findOne({ title: bookName });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const transactions = await Transaction.find({ bookId: book._id }).populate('userId');

        const currentlyIssued = transactions.find(t => !t.returnDate);
        const pastUsers = transactions.filter(t => t.returnDate).map(t => t.userId.name);

        res.status(200).json({
            success: true,
            current: currentlyIssued ? currentlyIssued.userId.name : 'Not issued',
            pastUsers,
            totalIssued: transactions.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTotalRentByBook = async (req, res) => {
    try {
        const { bookName } = req.query;
        const book = await Book.findOne({ title: bookName });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const transactions = await Transaction.find({ bookId: book._id });
        const totalRent = transactions.reduce((sum, t) => sum + (t.rentPaid || 0), 0);

        res.status(200).json({
            success: true,
            totalRent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBooksIssuedToPerson = async (req, res) => {
    try {
        const { userName } = req.query;
        const user = await Users.findOne({ name: userName });
        const transactions = await Transaction.find({ userId:user._id }).populate('bookId');

        const booksIssued = transactions.map(t => ({
            book: t.bookId.title,
            issueDate: t.issueDate,
            returnDate: t.returnDate
        }));

        res.status(200).json({
            success: true,
            booksIssued
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBooksIssuedInDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const transactions = await Transaction.find({
            issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('bookId');

        const booksIssued = transactions.map(t => ({
            book: t.bookId.title,
            user: t.userId.name,
            issueDate: t.issueDate,
            returnDate: t.returnDate
        }));

        res.status(200).json({
            success: true,
            booksIssued
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    listTransaction,
    issueBook,
    returnBook,
    getIssuedBookHistory,
    getTotalRentByBook,
    getBooksIssuedToPerson,
    getBooksIssuedInDateRange
}

