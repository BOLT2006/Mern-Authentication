import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs" // fs : File system allow Node.js to work with files
import path from "path"; // helps  you work with file and folder 
import { fileURLToPath } from "url"; // convert "file url" path to normal "Window path"
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url) //is used to get the full path of the current JavaScript file
const __dirname = path.dirname(__filename); // is used to get directory or folder



const verifyMail = async (token, email) => {

    const emailTemplateSource = fs.readFileSync(  //readFileSync :  Read a file synchronously. So Node will read the file before moving to the next line.
        path.join(__dirname, "template.hbs"),
        "utf-8" // Read the file as normal text without it may give you buffer (raw binary data)
    )

    const template = handlebars.compile(emailTemplateSource)  //takes that HTML template and turns it into a function.
    const htmlToSend = template({token : encodeURIComponent(token)}) // Take my template and give it this token value and encodeURIComponent : makes the token safe to put inside a URL.

  //Create transporter : is an object is used to handle the connection to  emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  // mail configuration
  const maiConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email - Verification",
    html: htmlToSend,
  };

  // send mail
  try {
    const info = await transporter.sendMail(maiConfiguration);
    console.log("Email Sent successfully");
    console.log(info);
  } catch (error) {
    console.log("Email sending failed:", error);
    throw error;
  }
};

export { verifyMail };
