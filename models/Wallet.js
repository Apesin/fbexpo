const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Wallet =  sequelize.define('wallets', {
    walletId: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    accountBalance: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    pin: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    dateGenerated: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'wallets',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "walletId" },
        ]
      },
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
  Wallet.associate = function(models) {
    Wallet.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
  }
  return Wallet;
};
