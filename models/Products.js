module.exports = function(sequelize, DataTypes) {
    const Products =  sequelize.define('products', {
      productId: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true
      },
      productName: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      productCode: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      dateCreated: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      dateModified: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(256),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'products',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "productId" },
          ]
        },
      ]
    });
 
    return Products;
  };
  