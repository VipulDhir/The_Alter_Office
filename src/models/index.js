const { Sequelize, DataTypes } = require('sequelize');
const cfg = require('../config/config');

const sequelize = new Sequelize(
  cfg.db.database,
  cfg.db.username,
  cfg.db.password,
  {
    host: cfg.db.host,
    dialect: 'mysql',        
    port: 3306,              
    logging: false
  }
);

const ApiKey = sequelize.define('ApiKey', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  appName: { type: DataTypes.STRING, allowNull: false },
  ownerEmail: { type: DataTypes.STRING, allowNull: true },
  apiKeyHash: { type: DataTypes.STRING, allowNull: false, unique: true },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  expiresAt: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'api_keys',
  underscored: true
});


const Event = sequelize.define('Event', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  appId: { type: DataTypes.UUID, allowNull: false },
  eventType: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.TEXT },
  referrer: { type: DataTypes.TEXT },
  device: { type: DataTypes.STRING },
  ipAddress: { type: DataTypes.STRING },
  userId: { type: DataTypes.STRING },
  userAgent: { type: DataTypes.TEXT },
  metadata: { type: DataTypes.JSON },   
  createdAt: { type: DataTypes.DATE, allowNull: false },
  receivedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, {
  tableName: 'events',
  underscored: true,
  timestamps: false
});

module.exports = { sequelize, ApiKey, Event };
