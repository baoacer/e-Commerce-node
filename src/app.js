require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const compresstion = require('compression')
const router = require('./routers/index')
const app = express();

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compresstion())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// init database
require('./database/init.mongodb')

// init router
app.use("/", router)

module.exports = app