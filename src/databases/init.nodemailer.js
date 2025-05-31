'use strict'

const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nguyenquocbaotu@gmail.com',
        pass: 'gjai elrj sech puum',
    },
})

module.exports = transport