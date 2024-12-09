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

// init handle
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    return next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500 //server
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: err.stack,
        message: err.message || 'Internal Server Error'
    })
})

module.exports = app