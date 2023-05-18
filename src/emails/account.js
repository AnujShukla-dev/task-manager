const sgMail = require('@sendgrid/mail');
const sendgridApiKey =process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridApiKey)


const sendWelomeEmail =(email,name)=>{
    sgMail.send({
        to:email,
        from :'bloomingcommerce@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app, ${name}.Let me know how you get along with the app`
    })
}

const deleteAccountEmail =(email,name)=>{
    sgMail.send({
        to:email,
        from :'bloomingcommerce@gmail.com',
        subject:'It was great having you!',
        text:`Your Account is removed successfully!, ${name}.`
    })
}

module.exports ={
    sendWelomeEmail,
    deleteAccountEmail
}