const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'users.db',
})

const Users = db.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  chekInTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  chekOutTime: {
    type: Sequelize.DATE,
  },
  checkedIn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
})

module.exports = {
  db, Users
}