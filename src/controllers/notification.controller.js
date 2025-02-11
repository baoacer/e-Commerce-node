'use strict'
const {SuccessResponse} = require('../core/success.response')
const NotificationService = require('../services/notification.service')

class NotificationController {
    static listNotiByUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get List Notification By User Success!",
            metadata: await NotificationService.listNotiByUser(req.body)
        }).send(res)
    }
}

module.exports = NotificationController