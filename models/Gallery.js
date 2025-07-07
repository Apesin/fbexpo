module.exports = function(sequelize, DataTypes) {
    const Events =  sequelize.define('gallery', {
      id: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      carId: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      file: {
        type: DataTypes.STRING(256),
        allowNull: false
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
      tableName: 'gallery',
    }
    );
    return Events;
  };
  