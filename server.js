const PORT = 3000;

// Configuring dotenv file
const dotenv = require('dotenv')
dotenv.config();

const express = require('express')

// Importing Sequelize models 
const { db, Users, Hosts } = require('./models/db')

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
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
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

// Visitor Check-Out
app.post('/checkIn', function (req, res) {

    let myCurrentTime = fetchDateTimeInMyFormat();

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

                bcrypt.hash(req.body.key, saltRounds, function (err, hash) {
                    // Store hash in your password DB.

                    const newUser = {
                        email: req.body.email,
                        key: hash,
                        name: req.body.name,
                        contactNo: req.body.contact,
                        hostName: req.body.hostName,
                        checkInTime: myCurrentTime,
                        checkOutTime: null,
                        checkedIn: true
                    }

                    // Create a new user
                    Users.create(newUser).then(user => {
                        // console.log(user)
                        // res.json(user)
                        console.log("User `Checked In`.")


                        // Find which HOST to mail 
                        let hostName = user.hostName;
                        Hosts.findOne({
                            where: {
                                name: hostName
                            }
                        }).then(function (record) {
                            if (record) {
                                // record exits
                                console.log("host Exists .")
                                let hostEmail = record.email;
                                console.log("hostEmail =>", hostEmail)

                                let hostContactNo = record.contactNo;
                                console.log("hostContactNo =>", hostContactNo)


                                // Sending a MAIL to the Host when a user Checks In

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


                                // // Sending a SMS to the Host when a user Checks In via NEXMO
                                // const Nexmo = require('nexmo');

                                // const nexmo = new Nexmo({
                                //     apiKey: process.env.NEXMO_API_KEY,
                                //     apiSecret: process.env.NEXMO_API_SECRET,
                                // });

                                // let smsText = `Visitor Check-In Details:\n` + mailText;

                                // const from = 'Nexmo';
                                // const to = '+91' + hostContactNo;
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



                                // success Redirect
                                res.render('redirect', {
                                    success: true,
                                    content: "User Checked In Successfully."
                                })

                            }
                            else {
                                // No Host Found

                                console.log("No Such Host Found.");
                                res.render('redirect', {
                                    failure: true,
                                    content: "OOPS! No Such Host Found."
                                })
                            }
                        })

                    })

                });

            }
        })
})


// Visitor Check-Out
app.post('/checkOut', function (req, res) {

    let myCurrentTime = fetchDateTimeInMyFormat();
    Users.findOne({
        where: {
            email: req.body.email,
            // key: req.body.key,
            checkedIn: true
        }
    })
        .then(function (record) {
            if (!record) {
                // record -> null
                // console.log(record)
                console.log("No such `Checked In` User Found!")

                res.render('redirect', {
                    failure: true,
                    content: "OOPS! No such Checked In User Found."
                })

            }
            else {

                // var keysMatched;

                // check key matches or not 
                let hashCheck = record.key;

                bcrypt.compare(req.body.key, hashCheck, function (err, response) {
                    if (response == true) {
                        // Keys match

                        record.update({
                            checkOutTime: myCurrentTime,
                            checkedIn: false
                        })
                            .then(() => {
                                console.log("Succefully `Checked Out`!")

                                var keysMatched = true;

                                // console.log("Key entered Match.")
                                // Getting Details of The Host 
                                checkOutHostName = record.hostName;

                                // Sending a mail to the user for CheckOut about the details of the visit.
                                let recipient = record.email;

                                let mailText = `Your visit details are given below: \nName - ${record.name},\nContact Number - ${record.contactNo},\nEmail Address - ${record.email},\nChecked-In at ${record.checkInTime.split(",")[0]} on ${record.checkInTime.split(",")[1]}\nChecked-Out at ${record.checkOutTime.split(",")[0]} on ${record.checkOutTime.split(",")[1]}\nHost visited - ${checkOutHostName}.`;
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
                        // Keys don't match

                        keysMatched = false;
                        console.log("Key entered does not match")

                        res.render('redirect', {
                            failure: true,
                            content: "OOPS! Key entered does not match."
                        })
                    }

                });


            }
        })
})

// Host Registration
app.post('/hostReg', (req, res) => {

    const newHost = {
        name: req.body.hostName,
        contactNo: req.body.hostContact,
        address: req.body.hostAddress,
        email: req.body.hostEmail,
        key: req.body.hostKey,
    }
    // console.log(newHost)

    Hosts.findOne({
        where: {
            email: req.body.hostEmail,
        }
    })
        .then(function (record) {
            if (record) {
                // console.log(record)

                console.log("Host Already `Exist` with the given email ID.");
                res.render('redirect', {
                    failure: true,
                    content: "OOPS! A Host Already exist with the given email ID."
                })
            }
            else {
                // record -> null

                Hosts.create(newHost).then(host => {
                    // console.log(user)
                    // res.json(user)
                    console.log("Host Registered.")

                    res.render('redirect', {
                        success: true,
                        content: "Host Registered Successfully."
                    })
                })
            }
        })

})


// Host DeRegistration
app.post('/hostDereg', (req, res) => {

    Hosts.findOne({
        where: {
            name: req.body.hostName,
            contactNo: req.body.hostContact,
            address: req.body.hostAddress,
            email: req.body.hostEmail,
            key: req.body.hostKey,
        }
    })
        .then(function (record) {
            if (record) {
                // console.log(record)

                record.destroy().then(() => {
                    console.log("Host Deregistered Successfully.")

                    res.render('redirect', {
                        success: true,
                        content: "Host Deregistered Successfully."
                    })
                })

            }
            else {
                // record -> null

                console.log("No Such Host Record Exist to De-Register.");
                res.render('redirect', {
                    failure: true,
                    content: "OOPS! No Such Host Record Exist to De-Register."
                })
            }
        })
})


db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`)
        // console.log(`Host Page on http://localhost:${PORT}/host`)
        // console.log(`Visitor Page on http://localhost:${PORT}/visitor`)
    })
})


// Function to return DateTime in my format
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
