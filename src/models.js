const { DataTypes } = require('sequelize');
const { sequelize } = require('./database');

// جدول المستخدمين
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
});

// جدول الطلبات
const Ticket = sequelize.define('Ticket', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'registration',
      'course',
      'account',
      'schedule',
      'mental_health',
      'medical',
      'student_affairs'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'closed'),
    defaultValue: 'open',
  },
});

// جدول الردود
const Reply = sequelize.define('Reply', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// العلاقات بين الجداول
User.hasMany(Ticket);
Ticket.belongsTo(User);

Ticket.hasMany(Reply);
Reply.belongsTo(Ticket);

User.hasMany(Reply);
Reply.belongsTo(User);

module.exports = { User, Ticket, Reply };