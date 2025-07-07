module.exports = function(sequelize, DataTypes) {
    const UsersToken =  sequelize.define('usersToken', {
      tokenId: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      secret: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(256),
        allowNull: false
        },
      status: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      dateGenerated: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'usersToken',
    }
    );
    return UsersToken;
  };
  