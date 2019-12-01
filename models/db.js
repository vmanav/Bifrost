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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contactNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hostName: {
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


const Hosts = db.define('host', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contactNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = {
  db, Users, Hosts
}