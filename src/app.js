const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const compresstion = require('compression')
const app = express();

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compresstion())



module.exports = app