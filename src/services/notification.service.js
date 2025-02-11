const { ORDER_01, ORDER_02, PROMOTION_01, SHOP_01 } = require('../utils/contants');
const { NOTI } = require('../models/notification.model');

class NotificationService{
    static async pushNotiToSystem({
        type = SHOP_01,
        recieverId,
        senderId,
        options = {}
    }){
        let notiContent

        if(type === SHOP_01){
            notiContent = `___ vừa thêm sản phẩm: ___`
        }else{
            notiContent = `___ vừa thêm voucher: ___`
        }

        const newNoti = await NOTI.create({
            noti_type: type,
            noti_senderId: senderId,
            noti_receiverId: recieverId,
            noti_content: notiContent,
            noti_options: options
        })
    }

    static async listNotiByUser({
        userId = 1,
        type = 'ALL',
        isRead = 0
    }){
        const match = { noti_receiverId: userId }

        if(type !== 'ALL'){
            match['noti_type'] = type
        }

        // aggregate : step prosess data 
        return await NOTI.aggregate([
            { // filter 
                $match: match
            },
            { // select field 
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receiverId: 1,
                    noti_content: 1,
                    noti_options: 1,
                    createAt: 1
                }
            }
        ])
    }
}

module.exports = NotificationService;