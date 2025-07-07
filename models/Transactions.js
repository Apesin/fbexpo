module.exports = function(sequelize, DataTypes) {
    const Transactions =  sequelize.define('transactions', {
        transactionId: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      walletId: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      transactionType: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      transactionReference: {
        type: DataTypes.STRING(256),
        allowNull: false
      }, 
      narration: {
        type: DataTypes.TEXT,
        allowNull: true
      },    
      dateCreated: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(256),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'transactions',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "transactionId" },
          ]
        },
      ]
    });

    return Transactions;
  };
  