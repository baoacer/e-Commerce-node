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
}

module.exports = NotificationService;