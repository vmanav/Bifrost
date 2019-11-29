// READ here -  http://www.passportjs.org
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

    var data = { 
        "email": req.body.email,
        "key": req.body.key
    }
    res.send(data)
})


app.post('/checkOut', function (req, res) {
    var data = {
        "email": req.body.email,
        "key": req.body.key
    }
    res.send(data)
})

db.sync().then(() => {
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})
})
