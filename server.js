// Setting Up HOST Details =>
const hostName = "Vishesh Singh";
const hostEmail = "zabhishek.verma@gmail.com";
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

app.post('/checkIn', function (req, res) {

    let myCurrentTime = fetchDateTimeInMyFormat();

    const newUser = {
        email: req.body.email,
        key: req.body.key,
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
