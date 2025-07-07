module.exports = function(sequelize, DataTypes) {
  const User =  sequelize.define('messages', {
    id: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    carId: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateModified: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'messages',
  }
  );
  return User;
};
