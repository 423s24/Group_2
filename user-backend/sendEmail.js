const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require('handlebars');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.google.com",
    port: 465,
    secure: true,
    auth: {
      user: "hrdc.maintenance.ticket.group2@gmail.com",
      pass: "jnqw thfe wcjo nvdw"
    }
});

app.post('/send-email', (req, res) => {
    const { formData, documentId } = req.body;

    const adminEmailTemplate = fs.readFileSync('./adminEmailTemplate.hbs', 'utf-8');
    const adminTemplate = handlebars.compile(adminEmailTemplate);
    const adminHTML = adminTemplate({ formData });


    const userEmailTemplate = fs.readFileSync('./userEmailTemplate.hbs', 'utf-8');
    const userTemplate = handlebars.compile(userEmailTemplate);
    const userHTML = userTemplate({ formData });

    console.log(documentId);

    const mailOptions = {
        from: "hrdc.maintenance.ticket.group2@gmail.com",
        to: "erikj3520@gmail.com",
        subject: "New Maintenance Ticket",
        html: adminHTML,
    };

    const userMailOptions = {
        from: "hrdc.maintenance.ticket.group2@gmail.com",
        to: formData.email,
        subject: "You Opened a Maintenance Ticket",
        html: userHTML,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            res.status(500).send('Error sending email');
        } else {
            console.log("Email sent: ", info.response);
            res.send('Email sent successfully');
        }
    });

    transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            res.status(500).send('Error sending email');
        } else {
            console.log("Email sent: ", info.response);
            res.send('Email sent successfully');
        }
    });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});



