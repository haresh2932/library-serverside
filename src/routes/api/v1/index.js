require('dotenv').config()
const express = require('express')
const router = express.Router()

const registerRouter=require("./user.routes")
const bookRouter=require("./book.routes")
const transactionRouter=require("./transaction.routes")

router.use("/users",registerRouter)
router.use("/books",bookRouter)
router.use("/transactions",transactionRouter)

module.exports=router



