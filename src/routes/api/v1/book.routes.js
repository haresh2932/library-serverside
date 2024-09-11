const express = require('express');
const { booksController } = require('../../../controller');
const router = express.Router();

router.get(
  '/',
  booksController.listBooks
);

router.get(
  '/search',
  booksController.getBooksByName
);
router.get(
  '/rent-range',
  booksController.getBooksByRentRange
);
router.get(
  '/criteria',
  booksController.getBooksByCriteria
);

router.post('/createBook', booksController.createBook);
router.get('/:id', booksController.getBookById);
router.put('/update/:id', booksController.updateBook);
router.delete('/delete/:id', booksController.deleteBook);
module.exports = router;