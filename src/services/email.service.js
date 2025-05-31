'use strict'
const OtpService = require('./otp.service')
const TemplateService = require('./template.service')
const transport = require('../databases/init.nodemailer')
const { NotFoundError } = require('../core/error.response')
const Utils = require('../utils')

class EmailService {

    static async sendEmailLinkVerify({
        html,
        toEmail,
        subject = 'Verify your email',
        text = 'Verify...',
    }){
        try {
            const mailOptions = {
                from: '"ShopDev" <nguyenquocbaotu@gmail.com>',
                to: toEmail,
                subject,
                text,
                html
            }

            transport.sendMail(mailOptions, (error, info) => {
                if(error){
                    return console.log(error)
                }

                console.log('Message sent:: ' + info.messageId)
            })
        } catch (error) {
            console.error("Error Email Send Link Verify: ", error)
            return error;
        }
    }

    static async sendEmailToken({ email = null }){
        try {
            //1. get token
            const token = await OtpService.newOtp({ email })

            // 2. get template
            const template = await TemplateService.getTemplate({
                tem_name: 'HTML EMAIL TOKEN'
            })

            // 3. replace placeholder
            if(!template) throw new NotFoundError('Template not found')

            const content = Utils.replacePlaceholder(
                template.tem_html, 
                {
                    link_verify: `http://localhost:3056/v1/api/welcome-back?token=${token.otp_token}`,
                }
            )

            // 4. send email 
            this.sendEmailLinkVerify({
                html: content,
                toEmail: email,
                subject: 'Vui lòng xác thực tài khoản của bạn đăng ký tại ShopDev',
            }).catch( err => console.error('Error send email: ', err))
            
            return 1;
        } catch (error) {
            throw new Error('Error Email Send Token')
        }
    }
}

module.exports = EmailService