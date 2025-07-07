module.exports = function(sequelize, DataTypes) {
    const Events =  sequelize.define('albums', {
      id: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: 'albums',
    }
    );
    return Events;
  };
  