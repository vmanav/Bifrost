// Setting Up HOST Details =>
const hostName = "HostName";
const hostEmail = "zmanav.1999@gmail.com";
const hostPhone = "8851729421";
const hostAddres = "houseNo., streetAddres, Society, City, State, Country";


const PORT = 3000;

const express = require('express')
const { db, Users } = require('./db')

// setting up bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// setting up nodemailer
const nodemailer = require('nodemailer');
// Details of account seding mails
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "zmanav.28@gmail.com",
        pass: "#manavmanu2017verma"
    }
});

const app = express()

app.set('view engine', 'hbs')
app.use('/scripts', express.static(__dirname + '/scripts'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.render('index'))

app.get('/host', (req, res) => res.render('host'))

app.get('/visitor', (req, res) => res.render('visitor'))

app.post('/checkIn', function (req, res) {

    let myCurrentTime = fetchDateTimeInMyFormat();

    const newUser = {
        email: req.body.email,
        key: req.body.key,
        name: req.body.name,
        contactNo: req.body.contact,
        checkInTime: myCurrentTime,
        checkOutTime: null,
        checkedIn: true
    }

    Users.findOne({
        where: {
            email: req.body.email,
            checkedIn: true
        }
    })
        .then(function (record) {
            if (record) {
                // console.log(record)

                console.log("User Already `Checked In` with the given email ID.");
                res.render('redirect', {
                    failure: true,
                    content: "OOPS! User Already Checked In with the given email ID."
                })
            }
            else {
                // record -> null
                Users.create(newUser).then(user => {
                    // console.log(user)
                    // res.json(user)
                    console.log("User `Checked In`.")

                    // Sending a mail to the Host when a user Checks In

                    let mailText = `Name - ${user.name},\nContact Number - ${user.contactNo},\nEmail Address - ${user.email},\nChecked-In at ${user.checkInTime.split(",")[0]} on ${user.checkInTime.split(",")[1]}.`;
                    var mailOptions = {
                        to: hostEmail,
                        subject: 'Visitor Check-In Details.',
                        text: mailText
                    }
                    smtpTransport.sendMail(mailOptions, function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('Email sent: ' + res.response);
                        }
                    })



                    // // Sending a sms to the Host when a user Checks In via NEXMO
                    // const Nexmo = require('nexmo');

                    // const nexmo = new Nexmo({
                    //     apiKey: '9217d0cd',
                    //     apiSecret: 'QYFh3ja05drpYSTS',
                    // });

                    // let smsText = `Visitor Check-In Details:\n` + mailText;

                    // const from = 'Nexmo';
                    // const to = '918851729421';
                    // const text = smsText;

                    // nexmo.message.sendSms(from, to, text, (err, responseData) => {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         if (responseData.messages[0]['status'] === "0") {
                    //             console.log("SMS sent successfully.");
                    //         } else {
                    //             console.log(`SMS failed with error: ${responseData.messages[0]['error-text']}`);
                    //         }
                    //     }
                    // });

                    res.render('redirect', {
                        success: true,
                        content: "User Checked In Successfully."
                    })
                })
            }
        })
})


app.post('/checkOut', function (req, res) {

    let myCurrentTime = fetchDateTimeInMyFormat();
    Users.findOne({
        where: {
            email: req.body.email,
            key: req.body.key,
            checkedIn: true
        }
    })
        .then(function (record) {
            if (record) {
                record.update({
                    checkOutTime: myCurrentTime,
                    checkedIn: false
                })
                    .then(() => {
                        console.log("Succefully `Checked Out`!")

                        // Sending a mail to the user for CheckOut about the details of the visit.
                        let recipient = record.email;

                        let mailText = `Your visit details are given below: \nName - ${record.name},\nContact Number - ${record.contactNo},\nEmail Address - ${record.email},\nChecked-In at ${record.checkInTime.split(",")[0]} on ${record.checkInTime.split(",")[1]}\nChecked-Out at ${record.checkOutTime.split(",")[0]} on ${record.checkOutTime.split(",")[1]}\nHost visited - ${hostName}.`;
                        var mailOptionsCheckOut = {
                            to: recipient,
                            subject: 'Thank You for your visit.',
                            text: mailText
                        }
                        smtpTransport.sendMail(mailOptionsCheckOut, function (err, res) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('Email sent: ' + res.response);
                            }
                        })

                        res.render('redirect', {
                            success: true,
                            content: "User Checked Out Successfully!"
                        })
                    })
            }
            else {
                // record -> null
                // console.log(record)
                console.log("No such `Checked In` User Found!")

                res.render('redirect', {
                    failure: true,
                    content: "OOPS! No such Checked In User Found."
                })

            }
        })
})

db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`)
    })
})

function fetchDateTimeInMyFormat() {
    let date = new Date;
    // date
    let day = date.getDate()
    if (day < 10) {
        day = "0" + day;
    }
    let month = date.getMonth() + 1
    if (month < 10) {
        month = "0" + month;
    }
    let year = date.getFullYear()
    let fullDate = day + "-" + month + "-" + year;
    // time
    let hours = date.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    let fullTime = hours + ":" + minutes + ":" + seconds;

    let myDateTime = fullTime + "," + fullDate;
    // console.log(myDateTime)
    return myDateTime;
}
