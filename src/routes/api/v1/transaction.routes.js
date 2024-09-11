const express = require('express');
const { transactionController } = require('../../../controller');
const router = express.Router();


router.post(
  '/issue',
  transactionController.issueBook
);
router.post(
  '/return',
  transactionController.returnBook
);
router.get(
  '/history',
  transactionController.getIssuedBookHistory
);
router.get(
  '/rent-total',
  transactionController.getTotalRentByBook
);
router.get(
  '/user-books',
  transactionController.getBooksIssuedToPerson
);
router.get(
  '/date-range', 
  transactionController.getBooksIssuedInDateRange
);

module.exports = router;
