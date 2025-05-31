const EmailService = require("../services/email.service")
const TemplateService = require("../services/template.service")
const { SuccessResponse } = require("../core/success.response")

class EmailController{

    async newTemplate(req, res, next){
        new SuccessResponse({
            message: "Add Stock To Inventory Success!",
            metadata: await TemplateService.newTemplate(req.body)
        }).send(res)
    }

   
}

module.exports = new EmailController()