const Sequelize = require("sequelize")

const {
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_DIALECT
} = require("../config")

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }, define: {
    timestamps: false
  }
})

sequelize.sync({ force: true })

const File = sequelize.define('file', {
  name: {
    type: Sequelize.STRING,
  },
  extension: {
    type: Sequelize.STRING
  },
  mimeType: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  passwordHash: {
    type: Sequelize.STRING
  }
})
 
module.exports = {
  User, File
}
