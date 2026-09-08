import nodemailer from "nodemailer"
import 'dotenv/config'

const verifyMail = async(token , email) => {
    //Create transporter : is an object is used to handle the connection to  emails
    const transporter = nodemailer.createTransport({
        service : gmail,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }
    })
    // mail configuration
    const maiConfiguration = {
        from : process.env.MAIL_USER,
        to : email,
        subject :"Email - Verification",
        html : <h1>Hey it is jus t a testing email</h1>
    }

    // send mail
    transporter.sendMail(maiConfiguration , function(error , info) {
        if(error){
            throw new Error(error)
        }
        console.log("Email Sent successfully")
        console.log(info)
    })

}

export {
    verifyMail
}