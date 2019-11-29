const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'users.db',
})

const Users = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  checkInTime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  checkOutTime: {
    type: Sequelize.STRING,
  },
  checkedIn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
})

module.exports = {
  db, Users
}