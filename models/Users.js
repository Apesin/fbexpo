module.exports = function(sequelize, DataTypes) {
  const User =  sequelize.define('users', {
    userId: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    accountLevel: {
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
    password: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dateCreated: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dateModified: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'users',
  }
  );
  return User;
};
