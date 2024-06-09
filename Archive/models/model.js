// models.js
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize to connect to your SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define the Data model
const Data = sequelize.define('Data', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  defect_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  station_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  screen_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, Data };
