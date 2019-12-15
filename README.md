<h1 align="center">Bifrost</h1>
<h4 align="center">Entry Management Software</h4>
<p>

  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/vmanav/Bifrost#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/vmanav/Bifrost/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/vmanav/Bifrost/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/vmanav/Bifrost" />
  </a>
</p>


### 🏠 [Homepage](https://github.com/vmanav/Bifrost#readme)


## About

Bifrost is a Node.js based Entry Management Software to manage meetings between Hosts and Clients conveniently. The functionalities supported are stated below :

* Host Register/ Deregister.
* Visitor Check-In/ Check-Out.
* Visitor Check-In Details mail and sms to respective host.
* Visit Details mail to visitor on Check-Out.


## Usage

### Prerequisites 

* Node.js installed
* Mongodb installed
* An account on Nexmo for keys and tokens to facilitate SMS functionality

### Installing Dependencies

To install Dependencies run

```sh
npm i
```

### Settings up Environment variables 

To setup the environment variables you have to create a .env file, add your Gmail and Nexmo Credentials to it in order to facilitate successful Email and SMS transfers respectively, as shown below

```sh
# nodemailer credetials

NODEMAILER_EMAIL=
NODEMAILER_PASS=

# nexmo credentials
NEXMO_API_KEY=
NEXMO_API_SECRET=
```



### Commands

After you have succefullyy set up the environment variables, to start the application you need to run

```sh
npm start
```

---

### <pre>Note : A Nexmo Free Account only supports sending SMS to verified mobile numbers, so the host number must be verified inorder to successfully recieve an SMS.</pre>


## Gallery

Snapshots of project.

Home Page
![Home Page](public/bifrostHome.png)

Host Registration Page
![Host Registration Page](public/host_reg.png)

Visitor Registration Page
![Visitor Registration Page](public/visitor_checkin.png)

Mail sent to Host when a Visitor Checks-in
![Check-in Mail sent to Host](public/mail_to_host.png)

SMS sent to Host when a Visitor Checks-in
![Check-in SMS to Host](public/hostMsg.jpeg)

Mail sent to Visitor on Checks-out
![Check-out Mail to Visitor](public/mail_to_visitor.jpeg)

## Author

👤 **Manav Verma**

* Github: [@vmanav](https://github.com/vmanav)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/vmanav/Bifrost/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Manav Verma](https://github.com/vmanav).<br />
This project is [GNU](https://github.com/vmanav/Bifrost/blob/master/LICENSE) licensed.

***
